import React, { useEffect, useState } from 'react';
import Post from './Post';
import { Button } from '@mantine/core';

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

const ExploreTab: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching explore posts...');
      const response = await fetch('/api/explore-data');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      console.log('Fetched explore posts:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    }
  };

  const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
    // Implementation remains the same
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 5px' }}>
      {posts.length > 0 ? (
        posts.map(post => (
          <Post
            key={post._id}
            _id={post._id}
            nickname={post.nickname || 'user'}
            title={post.title || ''}
            content={post.content || ''}
            likes={post.likes || 0}
            dislikes={post.dislikes || 0}
            comments={Array.isArray(post.comments) ? post.comments : []}
            createdAt={new Date(post.createdAt)}
            onAddComment={handleAddComment}
          />
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
};

export default ExploreTab;