import React from "react";
import {Modal, Button, TextInput, Textarea} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import './PostModal.css';

interface PostModalProps {
  onSubmit: (title: string, content: string) => void;
  refreshPosts: () => Promise<void>;
}

const PostModal: React.FC<PostModalProps> = ({ onSubmit, refreshPosts }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, author: 'Anonymous', nickname: 'zayan19' }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
  
      const newPost = await response.json();
      console.log('New post created:', newPost);
      onSubmit(newPost.title, newPost.content);
      setTitle('');
      setContent('');
      close();
      // Only call refreshPosts once
      await refreshPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <Button leftSection={<IconPlus size="1rem" />} onClick={open}>Post</Button>
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Post a Dem" 
        centered
        classNames={{
          root: 'post-modal-root',
          inner: 'post-modal-inner',
          content: 'post-modal',
          header: 'post-modal-header',
          title: 'post-modal-title',
        }}
      >
      <TextInput
        label="Topic"
        placeholder="Enter your topic"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        className="post-modal-input"
        styles={{ input: { height: '40px' , width: '380px'}  }}
      />
      <Textarea
        label="Content"
        placeholder="What's on your mind?"
        autosize
        minRows={4}
        maxRows={8}
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
        className="post-modal-textarea"
        styles={{ input: { height: '70px' , width: '380px'} }}
      />
        <div className="post-modal-button-container">
          <Button onClick={handleSubmit} className="post-modal-button">Post</Button>
        </div>
      </Modal>
    </>
  );
};

export default PostModal;