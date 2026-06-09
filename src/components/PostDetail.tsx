'use client';

import { useState, useEffect } from 'react';
import { getServerSession } from '@/lib/auth';
import { parseTags } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassyButton } from '@/components/ui/glassy-button';
import { ThumbsUp, ThumbsDown, Eye, MessageCircle, Heart, Trash2, Send, Tag } from 'lucide-react';

interface PostDetailProps {
  post: any;
}

export function PostDetail({ post }: PostDetailProps) {
  const [session, setSession] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [userVote, setUserVote] = useState<number | null>(null);
  const [postTags, setPostTags] = useState(parseTags(post.tags));
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    loadSession();
    loadComments();
    loadVote();
  }, [post.id]);

  const loadSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) setSession(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      if (res.ok) setComments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadVote = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/posts/${post.id}/vote`);
      if (res.ok) {
        const data = await res.json();
        setUserVote(data.voteType);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVote = async (voteType: number) => {
    if (!session) {
      // Show toast instead of alert
      const container = document.getElementById("toast-container");
      if (container) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300";
        toast.innerHTML = `
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-sm font-medium">Please login to vote</p>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
      return;
    }
    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });
      if (res.ok) {
        setUserVote(userVote === voteType ? null : voteType);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitComment = async () => {
    if (!session) {
      const container = document.getElementById("toast-container");
      if (container) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300";
        toast.innerHTML = `
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-sm font-medium">Please login to comment</p>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        setNewComment('');
        loadComments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async (commentId: number) => {
    if (!session) {
      const container = document.getElementById("toast-container");
      if (container) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300";
        toast.innerHTML = `
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-sm font-medium">Please login to reply</p>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, parentId: commentId }),
      });
      if (res.ok) {
        setReplyContent('');
        setReplyTo(null);
        loadComments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!session) {
      const container = document.getElementById("toast-container");
      if (container) {
        const toast = document.createElement("div");
        toast.className = "fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300";
        toast.innerHTML = `
          <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-sm font-medium">Please login to like</p>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
      return;
    }
    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
      loadComments();
    } catch (e) {
      console.error(e);
    }
  };

  const renderComments = (comments: any[], parentId: number | null = null) => {
    return comments
      .filter(c => c.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`ml-${parentId ? 8 : 0} border-l-2 border-border pl-4 py-2`}>
          <div className="flex items-start gap-3">
            {comment.avatar && (
              <img 
                src={comment.avatar} 
                alt={comment.username} 
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary"
                onClick={() => setSelectedUser(comment)}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => setSelectedUser(comment)}
                >
                  @{comment.username}
                </span>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-foreground">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className="h-8"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {comment.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="h-8"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                {session && (session.id === comment.authorId || session.isAdmin) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      // Custom confirmation dialog
                      const container = document.getElementById("toast-container");
                      if (container) {
                        const confirmDialog = document.createElement("div");
                        confirmDialog.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50";
                        confirmDialog.innerHTML = `
                          <div class="bg-background border rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                            <h3 class="text-lg font-semibold mb-2">Delete comment?</h3>
                            <p class="text-sm text-muted-foreground mb-4">This action cannot be undone. All replies to this comment will also be deleted.</p>
                            <div class="flex gap-2 justify-end">
                              <button id="cancel-delete" class="px-4 py-2 rounded-md border hover:bg-accent">Cancel</button>
                              <button id="confirm-delete" class="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</button>
                            </div>
                          </div>
                        `;
                        container.appendChild(confirmDialog);
                        
                        document.getElementById('cancel-delete')?.addEventListener('click', () => {
                          confirmDialog.remove();
                        });
                        
                        document.getElementById('confirm-delete')?.addEventListener('click', async () => {
                          await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' });
                          loadComments();
                          confirmDialog.remove();
                        });
                      }
                    }}
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {replyTo === comment.id && (
                <div className="mt-3 flex gap-2">
                  <Input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1"
                  />
                  <GlassyButton
                    onClick={() => handleReply(comment.id)}
                    className="h-8 px-4 py-2 text-sm"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Reply
                  </GlassyButton>
                </div>
              )}
            </div>
          </div>
          {renderComments(comments, comment.id)}
        </div>
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8 backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <div className="flex items-start gap-6">
            {post.logo && (
              <img src={post.logo} alt={post.title} className="w-24 h-24 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <CardTitle className="mb-2">{post.title}</CardTitle>
              <p className="text-muted-foreground mb-4">{post.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>by @{post.username}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {postTags && postTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {postTags.map(tag => (
                <span key={tag.id} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={userVote === 1 ? 'default' : 'outline'}
              onClick={() => handleVote(1)}
              className={userVote === 1 ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {post.upvotes}
            </Button>
            <Button
              variant={userVote === -1 ? 'default' : 'outline'}
              onClick={() => handleVote(-1)}
              className={userVote === -1 ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              {post.downvotes}
            </Button>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment... Use @username to mention someone"
                className="w-full px-4 py-3 border rounded-lg bg-background dark:bg-background/50 min-h-[100px]"
              />
              <GlassyButton
                onClick={handleSubmitComment}
                className="mt-2"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </GlassyButton>
            </div>
          ) : (
            <p className="mb-6 text-muted-foreground">
              <Link href="/auth/login" className="text-primary hover:underline">Login</Link> to comment
            </p>
          )}

          <div className="space-y-4">
            {renderComments(comments)}
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedUser(null)}
        >
          <Card 
            className="max-w-sm w-full mx-4 backdrop-blur-sm bg-white/50 dark:bg-black/50"
            style={{ borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {selectedUser.avatar && (
                  <img src={selectedUser.avatar} alt={selectedUser.username} className="w-16 h-16 rounded-full object-cover" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{selectedUser.name || selectedUser.username}</h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                  {selectedUser.pronouns && <p className="text-sm text-muted-foreground">{selectedUser.pronouns}</p>}
                </div>
              </div>
              {selectedUser.bio && <p className="text-sm mb-4">{selectedUser.bio}</p>}
              <div className="text-xs text-muted-foreground">
                Joined: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <Button 
                className="w-full mt-4"
                variant="metal"
                onClick={() => {
                  window.location.href = `/@${selectedUser.username}`;
                }}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
