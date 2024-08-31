import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { nickname: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    const { nickname } = params;

    const likedPosts = await db.collection("posts").find({
      "votes": { $elemMatch: { nickname: nickname, vote: 1 } }
    }).toArray();

    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error('Failed to fetch liked posts:', error);
    return NextResponse.json({ error: 'Failed to fetch liked posts' }, { status: 500 });
  }
}