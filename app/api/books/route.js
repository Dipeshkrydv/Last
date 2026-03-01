import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { Op } from 'sequelize';
import sequelize from '@/lib/db';
import models from '@/models/index';
const { Book, User } = models;
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    let whereClause = {};
    if (query) {
      // Improved Tag & Search Algorithm
      const lowerQuery = query.toLowerCase().trim();
      const tokens = lowerQuery.split(/\s+/).filter(Boolean);

      if (tokens.length > 0) {
        // We want to prioritize books that match the query in the 'keywords' (tags) field.
        // Or if the title matches well.
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${query}%` } },
          { keywords: { [Op.like]: `%${tokens.join('%')}%` } }
        ];
      }
    }
    if (category) {
      whereClause.category = category;
    }

    // GEO-SPATIAL search:
    if (lat && lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const distance = 10; // in KM

        // Haversine formula in Sequelize
        const haversine = `(
            6371 * acos(
                cos(radians(:latitude)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(:longitude)) +
                sin(radians(:latitude)) * sin(radians(latitude))
            )
        )`;

        const books = await Book.findAll({
            where: whereClause,
            replacements: { latitude, longitude },
            include: [{
                model: User,
                attributes: ['name', 'email', 'city', 'province'],
                where: sequelize.where(sequelize.literal(haversine), '<=', distance),
                required: true // Ensures we only get books from users within the radius
            }]
        });

        return NextResponse.json(books);

    } else {
        const books = await Book.findAll({ 
            where: whereClause,
            include: [{
                model: User,
                attributes: ['name', 'email', 'city', 'province']
            }]
        });
        return NextResponse.json(books);
    }

  } catch (error) {
    console.error('Books GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['seller', 'admin'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.formData();
        const file = data.get('coverImage');

        if (!file) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save the file to the filesystem
        const filename = `${Date.now()}-${file.name}`;
        const dirPath = path.join(process.cwd(), 'public', 'uploads');
        const filepath = path.join(dirPath, filename);

        await mkdir(dirPath, { recursive: true });
        await writeFile(filepath, buffer);

        const coverImageUrl = `/uploads/${filename}`;

        // Create a new book record in the database
        const newBook = await Book.create({
            title: data.get('title'),
            author: data.get('author'),
            description: data.get('description'),
            price: data.get('price'),
            category: data.get('category'),
            condition: data.get('condition'),
            language: data.get('language'),
            isbn: data.get('isbn'),
            tags: data.get('tags'), // Or keywords
            coverImageUrl: coverImageUrl,
            sellerId: session.user.id
        });

        return NextResponse.json(newBook, { status: 201 });

    } catch (error) {
        console.error("Book POST Error: ", error);
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
    }
}
