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

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        console.log('Fetched posts:', JSON.stringify(data, null, 2));
        setPosts(data);
        if (hasDuplicates(data)) {
          await deleteDuplicatePosts();
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const hasDuplicates = (posts: PostData[]) => {
      const titles = posts.map(post => post.title);
      return titles.length !== new Set(titles).size;
    };
  
    const handleAddComment = async (postId: string, content: string, author: string, parentCommentId?: string) => {
      console.log('Adding comment:', { postId, content, author, parentCommentId });
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
  
        const result = await response.json();
        console.log('Comment added successfully:', result);
  
        // Refresh the posts after adding a comment
        await fetchPosts();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const deleteDuplicatePosts = async () => {
      try {
        const response = await fetch('/api/posts/delete-duplicates', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to delete duplicate posts');
        }
        console.log('Duplicate posts deleted successfully');
        await fetchPosts(); // Refresh the posts after deleting duplicates
      } catch (error) {
        console.error('Error deleting duplicate posts:', error);
      }
    };

    const resetPosts = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to reset posts');
        }
        fetchPosts(); // Refresh the posts after resetting
      } catch (error) {
        console.error('Error resetting posts:', error);
      }
    };
  
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 5px' }}>
        <Button onClick={resetPosts} color="red" size="xs" style={{ marginBottom: '20px' }}>
          Reset All Posts
        </Button>
        {posts.length > 0 ? (
          posts.map(post => (
            <Post
              key={post._id}
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
          ))
        ) : (
          <p>No posts available. Be the first to create a post!</p>
        )}
      </div>
    );
  };

export default HomePage;