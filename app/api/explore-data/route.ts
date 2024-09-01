import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    console.log('Fetching explore data...');
    const jsonDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(jsonDirectory, 'reddit_posts_with_comments.json');
    
    console.log('Attempting to read file:', filePath);
    const fileContents = await fs.readFile(filePath, 'utf8');
    
    const data = JSON.parse(fileContents);
    
    if (!data.posts || !Array.isArray(data.posts)) {
      throw new Error('Invalid data structure in JSON file');
    }

    // Take only the first 4 posts
    const posts = data.posts.slice(0, 16);

    // Transform the Reddit data to match our PostData interface
    const transformedPosts = posts.map((post: any) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      nickname: post.nickname,
      comments: post.comments || [],
      likes: post.likes,
      dislikes: post.dislikes,
      createdAt: post.createdAt
    }));

    console.log('Transformed posts:', transformedPosts);
    return NextResponse.json(transformedPosts);
  } catch (err) {
    console.error('Error reading or parsing JSON file:', err);
    return NextResponse.json({ error: 'Failed to fetch explore data', details: err.message }, { status: 500 });
  }
}