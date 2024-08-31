import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const nickname = searchParams.get('nickname');

    const client = await clientPromise;
    const db = client.db("reddit_clone");

    let query = {};
    if(nickname) {
      query = {nickname: nickname};
    }

    const posts = await db.collection("posts").find(query).sort({ createdAt: -1 }).toArray();
    console.log('Posts fetched from database:', JSON.stringify(posts, null, 2));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    const { title, content, author, nickname } = await request.json();
    const newPost = {
      title: typeof title === 'object' ? JSON.stringify(title) : title,
      content,
      author,
      nickname,
      comments: [],
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection("posts").insertOne(newPost);
    const createdPost = {...newPost, _id: result.insertedId};
    return NextResponse.json(createdPost);
  } catch (error) {
    console.error('Failed to add post:', error);
    return NextResponse.json({ error: 'Failed to add post' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db("reddit_clone");
    await db.collection("posts").deleteMany({});
    return NextResponse.json({ message: 'All posts deleted' });
  } catch (error) {
    console.error('Failed to delete posts:', error);
    return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 });
  }
}