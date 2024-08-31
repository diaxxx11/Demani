import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    const postsCollection = db.collection("posts");

    const result = await postsCollection.aggregate([
      {
        $group: {
          _id: { title: "$title", content: "$content" },
          dups: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    for (let dup of result) {
      dup.dups.shift(); // Keep one document
      await postsCollection.deleteMany({ _id: { $in: dup.dups } });
    }

    return NextResponse.json({ message: 'Duplicate posts deleted successfully' });
  } catch (error) {
    console.error('Failed to delete duplicate posts:', error);
    return NextResponse.json({ error: 'Failed to delete duplicate posts' }, { status: 500 });
  }
}