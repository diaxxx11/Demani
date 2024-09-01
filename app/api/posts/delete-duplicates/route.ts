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
          docs: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();

    for (let group of result) {
      // Sort the documents by createdAt date, oldest first
      group.docs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      // Keep the oldest document
      const toKeep = group.docs[0]._id;
      
      // Delete all other documents in this group
      await postsCollection.deleteMany({
        _id: { $in: group.docs.slice(1).map(doc => doc._id) },
        title: group._id.title,
        content: group._id.content
      });
    }

    return NextResponse.json({ message: 'Duplicate posts deleted successfully' });
  } catch (error) {
    console.error('Failed to delete duplicate posts:', error);
    return NextResponse.json({ error: 'Failed to delete duplicate posts' }, { status: 500 });
  }
}