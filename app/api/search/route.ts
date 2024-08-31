import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");

    const searchRegex = new RegExp(q.split(' ').join('|'), 'i');

    const results = await db.collection("posts").find({
      $or: [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { 'comments.content': { $regex: searchRegex } }
      ]
    }).toArray();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}