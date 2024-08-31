import React, { useEffect, useState } from 'react';
import Post from './Post';
import { useParams } from 'next/navigation';

interface PostData {
  _id: string;
  title: string;
  content: string;
  author: string;
  nickname: string;
  comments: any[];
  likes: number;
  dislikes: number;
  createdAt: string;
}

const PostPage: React.FC = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    console.log("PostPage useEffect triggered. ID:", id);
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    console.log("Fetching post with ID:", postId);
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched post data:", data);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post. Please try again later.');
    }
  };

  const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
    try {
      const response = await fetch('/api/posts/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content, author, parentCommentId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
  
      const result = await response.json();
      console.log('Comment added successfully:', result);
  
      // Refresh the post after adding a comment
      fetchPost(postId);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {post ? (
        <Post
          _id={post._id}
          nickname={post.nickname || 'user'}
          title={typeof post.title === 'object' ? JSON.stringify(post.title) : (post.title || '')}
          content={post.content || ''}
          likes={post.likes || 0}
          dislikes={post.dislikes || 0}
          comments={Array.isArray(post.comments) ? post.comments : []}
          createdAt={new Date(post.createdAt)}
          onAddComment={handleAddComment}
        />
      ) : (
        <p>Loading... (Post ID: {id})</p>
      )}
    </>
  );
};

export default PostPage;