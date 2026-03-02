import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import models from '@/models/index';
const { Order, Book, User } = models;
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.findAll({
      where: { buyerId: session.user.id },
      include: [
        { model: Book, as: 'book', include: [{ model: User, as: 'seller', attributes: ['name', 'city'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
