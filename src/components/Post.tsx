import React, { useState } from 'react';
import './Post.css';
import './Modal.css';
import { UnstyledButton, Modal, Textarea, Button, Group, Text, ActionIcon, Timeline, Menu } from '@mantine/core';
import Image from 'next/image';
import { IconMinus, IconPlus, IconShare, IconCopy } from '@tabler/icons-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  createdAt: Date;
}

interface PostProps {
  _id: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: Date;
  comments: Comment[];
  likes: number;
  dislikes: number;
  onAddComment: (postId: string, content: string, author: string, parentCommentId?: string) => void;
}

const VoteButton: React.FC<{ onClick: () => void; direction: 'up' | 'down'; isActive: boolean; size?: 'small' | 'normal' }> = ({ onClick, direction, isActive, size = 'normal' }) => (
  <UnstyledButton onClick={onClick} className={`vote-button vote-${direction} ${isActive ? 'active' : ''} ${size}`}>
    <Image src={`/${direction}vote.png`} alt={`${direction}vote`} width={size === 'small' ? 14 : 20} height={size === 'small' ? 14 : 20} />
  </UnstyledButton>
);

const CommentComponent: React.FC<{ comment: Comment; level: number; onAddComment: (content: string, parentCommentId: string) => void }> = ({ comment, level, onAddComment }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [voteCount, setVoteCount] = useState(comment.likes - comment.dislikes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleAddReply = () => {
    if (replyContent.trim()) {
      onAddComment(replyContent, comment.id);
      setReplyContent('');
      setIsReplyModalOpen(false);
    }
  };

  // const voteCount = (comment.likes || 0) - (comment.dislikes || 0);


  const handleVote = (direction: 'up' | 'down') => {
    if (userVote === direction) {
      // Cancel vote
      setUserVote(null);
      setVoteCount(prevCount => direction === 'up' ? prevCount - 1 : prevCount + 1);
    } else {
      // New vote or change vote
      setUserVote(direction);
      setVoteCount(prevCount => {
        if (userVote === null) {
          return direction === 'up' ? prevCount + 1 : prevCount - 1;
        } else {
          return direction === 'up' ? prevCount + 2 : prevCount - 2;
        }
      });
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/comment/${comment.id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className={`comment level-${level}`}>
      <div className="comment-content">
        <div className="comment-header">
          <Text size="xs" weight={500}>u/{comment.author || 'Anonymous'}</Text>
          <Text size="xs" color="dimmed"> • {voteCount} points • {new Date(comment.createdAt).toLocaleString()}</Text>
        </div>
        <Text size="sm">{comment.content}</Text>
        <div className="comment-actions">
        <div className="vote-section">
          <VoteButton onClick={() => handleVote('up')} direction="up" isActive={userVote === 'up'} size="small" />
          <Text size="xs" weight={700}>{voteCount > 0 ? voteCount : ''}</Text>
          <VoteButton onClick={() => handleVote('down')} direction="down" isActive={userVote === 'down'} size="small" />
          <Text size="xs" weight={700}>{voteCount < 0 ? Math.abs(voteCount) : ''}</Text>
        </div>
          <Button variant="subtle" size="xs" color="dark" onClick={() => setIsReplyModalOpen(true)}>
            Reply
          </Button>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" size="xs" color="dark" leftIcon={<IconShare size={14} />}>
                Share
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconCopy size={14} />} onClick={handleCopyUrl}>
                Copy URL
              </Menu.Item>
            </Menu.Dropdown>
            </Menu>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} level={level + 1} onAddComment={onAddComment} />
          ))}
        </div>
      )}
      <Modal 
        opened={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="Reply to comment"
        centered
        classNames={{
          root: 'post-modal-root',
          inner: 'post-modal-inner',
          content: 'post-modal',
          header: 'post-modal-header',
          title: 'post-modal-title',
        }}
      >
        <Textarea
          placeholder="Your reply"
          value={replyContent}
          onChange={(event) => setReplyContent(event.currentTarget.value)}
          autosize
          minRows={4}
          maxRows={8}
          className="post-modal-textarea"
          styles={{ input: { height: '70px', width: '380px' } }}
        />
        <div className="post-modal-button-container">
          <Button onClick={handleAddReply} className="post-modal-button">Submit</Button>
        </div>
      </Modal>
      </div>
    );
  }

const Post: React.FC<PostProps> = ({ _id, nickname, title, content, likes, dislikes, comments, createdAt, onAddComment }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [voteCount, setVoteCount] = useState(likes - dislikes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);


  const formatDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleString();
    }
    return date instanceof Date ? date.toLocaleString() : 'Unknown date';
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(_id, newComment, nickname);
      setNewComment('');
      setIsCommentModalOpen(false);
    }
  };

  const handleVote = async (direction: 'up' | 'down') => {
    if (userVote === direction) {
      // Cancel vote
      setUserVote(null);
      setVoteCount(prevCount => direction === 'up' ? prevCount - 1 : prevCount + 1);
    } else {
      // New vote or change vote
      setUserVote(direction);
      setVoteCount(prevCount => {
        if (userVote === null) {
          return direction === 'up' ? prevCount + 1 : prevCount - 1;
        } else {
          return direction === 'up' ? prevCount + 2 : prevCount - 2;
        }
      });
    }
  
    try {
      const response = await fetch(`/api/posts/${_id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, vote: direction === 'up' ? 1 : -1 }),
      });
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      // Revert the local state change if the API call fails
      setUserVote(prevVote => prevVote);
      setVoteCount(prevCount => prevCount);
    }
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/post/${_id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="post">
      <div className="post-content">
        <p className="nickname">u/{nickname || 'Anonymous'}</p>
        <h2 className="post-title">{title || 'Untitled'}</h2>
        <p className="post-body">{content || 'No content'}</p>
        <div className="post-actions">
        <div className="vote-section">
          <VoteButton onClick={() => handleVote('up')} direction="up" isActive={userVote === 'up'} />
          <Text size="sm" weight={700}>{voteCount > 0 ? voteCount : ''}</Text>
          <VoteButton onClick={() => handleVote('down')} direction="down" isActive={userVote === 'down'} />
          <Text size="sm" weight={700}>{voteCount < 0 ? Math.abs(voteCount) : ''}</Text>
        </div>
          <Button onClick={() => setIsCommentModalOpen(true)} variant="subtle" size="sm" color="dark">
            Comment ({comments?.length || 0})
          </Button>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" size="sm" color="dark" leftIcon={<IconShare size={14} />}>
                Share
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconCopy size={14} />} onClick={handleCopyUrl}>
                Copy URL
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <p className="date">{formatDate(createdAt)}</p>
      </div>



      <div className="comments-section">
        <Timeline radius="sm" active={-1} bulletSize={18}>
          {comments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} level={0} onAddComment={(content, parentCommentId) => onAddComment(_id, content, nickname, parentCommentId)} />
          ))}
        </Timeline>
      </div>

      <Modal
        opened={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title="Add a comment"
        centered
        classNames={{
          root: 'post-modal-root',
          inner: 'post-modal-inner',
          content: 'post-modal',
          header: 'post-modal-header',
          title: 'post-modal-title',
        }}
      >
        <Textarea
          placeholder="Your comment"
          value={newComment}
          onChange={(event) => setNewComment(event.currentTarget.value)}
          autosize
          minRows={4}
          maxRows={8}
          className="post-modal-textarea"
          styles={{ input: { height: '70px', width: '380px' } }}
        />
        <div className="post-modal-button-container">
          <Button onClick={handleAddComment} className="post-modal-button">Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Post;