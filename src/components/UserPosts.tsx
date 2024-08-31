import React, { useEffect, useState } from 'react';
import Post from './Post';

interface PostData {
  _id: string;
  title: string | object;
  content: string;
  nickname: string;
  createdAt: string;
  comments: any[];
  likes: number;
  dislikes: number;
}

const UserPosts: React.FC<{ nickname: string }> = ({ nickname }) => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    fetchUserPosts();
  }, [nickname]);

  const fetchUserPosts = async () => {
    try {
      console.log('Fetching posts for nickname:', nickname);
      const response = await fetch(`/api/posts?nickname=${encodeURIComponent(nickname)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
      if(Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error('Fetched user data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content, author, parentCommentId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
  
      // Refresh the posts after adding a comment
      await fetchUserPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      {posts.map(post => (
        <Post
          key={post._id}
          _id={post._id}
          nickname={post.nickname || 'Anonymous'}
          title={ typeof post.title === 'object' ? JSON.stringify(post.title) : (post.title || 'Untitled')}
          content={post.content || ''}
          likes={post.likes || 0}
          dislikes={post.dislikes || 0}
          comments={Array.isArray(post.comments) ? post.comments : []}
          createdAt={new Date(post.createdAt)}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
};

export default UserPosts;