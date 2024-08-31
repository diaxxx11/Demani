import React, { useEffect, useState } from 'react';
import { Text } from '@mantine/core';

interface CommentData {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
  postId: string;
  postTitle: string;
}

const UserComments: React.FC<{ nickname: string }> = ({ nickname }) => {
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    fetchUserComments();
  }, [nickname]);

  const fetchUserComments = async () => {
    try {
      const response = await fetch(`/api/users/${nickname}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch user comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching user comments:', error);
    }
  };

  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id} className="comment-item">
          <Text size="sm">Commented on: {comment.postTitle}</Text>
          <Text>{comment.content}</Text>
          <Text size="xs" color="dimmed">{new Date(comment.createdAt).toLocaleString()}</Text>
        </div>
      ))}
    </div>
  );
}

export default UserComments;