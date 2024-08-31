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

    const commentedPosts = await db.collection("posts").aggregate([
      { $match: { "comments.author": nickname } },
      { $unwind: "$comments" },
      { $match: { "comments.author": nickname } },
      { $project: {
        _id: 1,
        postTitle: "$title",
        content: "$comments.content",
        author: "$comments.author",
        createdAt: "$comments.createdAt"
      }}
    ]).toArray();

    return NextResponse.json(commentedPosts);
  } catch (error) {
    console.error('Failed to fetch commented posts:', error);
    return NextResponse.json({ error: 'Failed to fetch commented posts' }, { status: 500 });
  }
}