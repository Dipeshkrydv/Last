import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Order, Book } from '@/models/index';
import { authOptions } from '@/lib/auth';
import sequelize from '@/lib/db';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'buyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty. Please add books before checkout.' }, { status: 400 });
    }

    await sequelize.transaction(async (t) => {
      const bookIds = cartItems.map(item => item.id || item.bookId);

      // Fetch all books in a single query
      const books = await Book.findAll({
        where: { id: bookIds },
        transaction: t,
      });

      // Map books for quick lookup and validation
      const bookMap = new Map();
      books.forEach((b) => bookMap.set(b.id, b));

      const ordersData = [];

      for (const item of cartItems) {
        const bookId = item.id || item.bookId;
        const book = bookMap.get(bookId);

        if (!book) {
          throw new Error(`Book with ID ${bookId} not found.`);
        }

        if (book.status !== 'available') {
          throw new Error(`Book "${book.title}" is no longer available.`);
        }

        // Mark book as on-hold immediately in memory to prevent duplicate cart items
        book.status = 'on-hold';

        ordersData.push({
          buyerId: session.user.id,
          bookId: book.id,
          status: 'pending',
          totalAmount: book.price, // Trust DB price
        });
      }

      // Create all orders at once
      await Order.bulkCreate(ordersData, { transaction: t });

      // Update all book statuses at once
      await Book.update(
        { status: 'on-hold' },
        { where: { id: bookIds }, transaction: t }
      );
    });

    return NextResponse.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
