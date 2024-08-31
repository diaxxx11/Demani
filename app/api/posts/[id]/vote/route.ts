import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    const { id } = params;
    const { nickname, vote } = await request.json();

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { 
        $pull: { votes: { nickname: nickname } },
        $inc: { likes: vote === 1 ? 1 : 0, dislikes: vote === -1 ? 1 : 0 }
      }
    );

    if (vote !== 0) {
      await db.collection("posts").updateOne(
        { _id: new ObjectId(id) },
        { $push: { votes: { nickname, vote } } }
      );
    }

    return NextResponse.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json({ message: "Error recording vote", error: error.message }, { status: 500 });
  }
}