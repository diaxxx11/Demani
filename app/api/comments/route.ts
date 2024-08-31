import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    const { postId, content, author, parentCommentId } = await req.json();
    console.log('Received comment data:', { postId, content, author, parentCommentId });

    const newComment = {
      id: new ObjectId().toString(),
      content,
      author,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      replies: [],
    };

    let updateResult;
    if (parentCommentId) {
      // This is a reply to an existing comment
      updateResult = await db.collection("posts").updateOne(
        { _id: new ObjectId(postId), "comments.id": parentCommentId },
        { $push: { "comments.$.replies": newComment } }
      );
    } else {
      // This is a top-level comment
      updateResult = await db.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: newComment } }
      );
    }

    console.log('Database update result:', updateResult);

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update the post with the new comment');
    }

    return NextResponse.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ message: "Error adding comment", error: error.message }, { status: 500 });
  }
}