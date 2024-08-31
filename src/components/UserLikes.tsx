import React, { useEffect, useState } from 'react';
import Post from './Post';

interface PostData {
  _id: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  comments: any[];
  likes: number;
  dislikes: number;
}

const UserLikes: React.FC<{ nickname: string }> = ({ nickname }) => {
  const [likedPosts, setLikedPosts] = useState<PostData[]>([]);

  useEffect(() => {
    fetchUserLikes();
  }, [nickname]);

  const fetchUserLikes = async () => {
    try {
      const response = await fetch(`/api/users/${nickname}/likes`);
      if (!response.ok) {
        throw new Error('Failed to fetch user likes');
      }
      const data = await response.json();
      setLikedPosts(data);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
    // Implementation similar to UserPosts
  };

  return (
    <div>
      {likedPosts.map(post => (
        <Post
          key={post._id}
          _id={post._id}
          nickname={post.nickname || 'Anonymous'}
          title={typeof post.title === 'object' ? JSON.stringify(post.title) : (post.title || 'Untitled')}
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
}

export default UserLikes;