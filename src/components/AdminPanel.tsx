'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Users, FileText, Plus, Tag, Trash2, Shield, Ban, CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';

export function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'create-post' | 'tags'>('users');
  const [newPost, setNewPost] = useState({ title: '', description: '', content: '', logo: '', tags: [] as number[] });
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: number; name: string } | null>(null);
  const [editingUser, setEditingUser] = useState<{ id: number; username: string } | null>(null);
  const [editingPost, setEditingPost] = useState<{ id: number; title: string; description: string; content: string; logo: string } | null>(null);

  useEffect(() => {
    loadUsers();
    loadPosts();
    loadTags();
  }, []);

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
  };

  const loadPosts = async () => {
    const res = await fetch('/api/posts');
    if (res.ok) setPosts(await res.json());
  };

  const loadTags = async () => {
    const res = await fetch('/api/tags');
    if (res.ok) setTags(await res.json());
  };

  const handleSuspendUser = async (userId: number, suspend: boolean, reason = '') => {
    const res = await fetch('/api/admin/users/suspend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, suspend, reason }),
    });
    if (res.ok) loadUsers();
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (res.ok) loadUsers();
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const res = await fetch(`/api/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: editingUser.username }),
    });
    if (res.ok) {
      setEditingUser(null);
      loadUsers();
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    const res = await fetch(`/api/posts/${editingPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editingPost.title,
        description: editingPost.description,
        content: editingPost.content,
        logo: editingPost.logo,
      }),
    });
    if (res.ok) {
      setEditingPost(null);
      loadPosts();
    }
  };

  const handleTogglePin = async (postId: number, pinned: number) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: pinned ? 0 : 1 }),
    });
    if (res.ok) loadPosts();
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) loadPosts();
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    if (res.ok) {
      setNewPost({ title: '', description: '', content: '', logo: '', tags: [] });
      loadPosts();
      setActiveTab('posts');
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTag }),
    });
    if (res.ok) {
      setNewTag('');
      loadTags();
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    const res = await fetch(`/api/tags/${editingTag.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingTag.name }),
    });
    if (res.ok) {
      setEditingTag(null);
      loadTags();
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    if (!confirm('Delete this tag?')) return;
    const res = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
    if (res.ok) loadTags();
  };

  const togglePostTag = (tagId: number) => {
    if (newPost.tags.includes(tagId)) {
      setNewPost({ ...newPost, tags: newPost.tags.filter(t => t !== tagId) });
    } else {
      setNewPost({ ...newPost, tags: [...newPost.tags, tagId] });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Admin Panel</h1>

      <div className="flex gap-2 mb-6 border-b">
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('users')}
          className="rounded-b-none"
        >
          <Users className="h-4 w-4 mr-2" />
          Users
        </Button>
        <Button
          variant={activeTab === 'posts' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('posts')}
          className="rounded-b-none"
        >
          <FileText className="h-4 w-4 mr-2" />
          Posts
        </Button>
        <Button
          variant={activeTab === 'create-post' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create-post')}
          className="rounded-b-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
        <Button
          variant={activeTab === 'tags' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('tags')}
          className="rounded-b-none"
        >
          <Tag className="h-4 w-4 mr-2" />
          Tags
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Username</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Admin</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        {editingUser?.id === user.id ? (
                          <form onSubmit={handleUpdateUser} className="flex gap-2">
                            <Input
                              type="text"
                              value={editingUser?.username || ''}
                              onChange={(e) => setEditingUser(editingUser ? { ...editingUser, username: e.target.value } : null)}
                              className="w-32"
                            />
                            <Button type="submit" size="sm">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2">
                            @{user.username}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser({ id: user.id, username: user.username })}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-sm">
                            <Shield className="h-4 w-4 text-primary" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {user.isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-sm text-destructive">
                            <XCircle className="h-4 w-4" />
                            Suspended: {user.suspensionReason}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2">
                        {user.isSuspended ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspendUser(user.id, false)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Unsuspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const reason = prompt('Suspension reason:');
                              if (reason) handleSuspendUser(user.id, true, reason);
                            }}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4">
                {editingPost?.id === post.id ? (
                  <form onSubmit={handleUpdatePost} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editingPost?.title || ''}
                        onChange={(e) => setEditingPost(editingPost ? { ...editingPost, title: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={editingPost?.description || ''}
                        onChange={(e) => setEditingPost(editingPost ? { ...editingPost, description: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo URL</Label>
                      <Input
                        value={editingPost?.logo || ''}
                        onChange={(e) => setEditingPost(editingPost ? { ...editingPost, logo: e.target.value } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <textarea
                        value={editingPost?.content || ''}
                        onChange={(e) => setEditingPost(editingPost ? { ...editingPost, content: e.target.value } : null)}
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-background/50"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingPost(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{post.title}</h3>
                        {post.pinned && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Pinned</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">by @{post.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePin(post.id, post.pinned)}
                      >
                        {post.pinned ? 'Unpin' : 'Pin'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPost({ id: post.id, title: post.title, description: post.description, content: post.content, logo: post.logo })}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'create-post' && (
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={newPost.logo}
                  onChange={(e) => setNewPost({ ...newPost, logo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={newPost.tags.includes(tag.id) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => togglePostTag(tag.id)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                  rows={10}
                  className="w-full px-4 py-2 border rounded-lg bg-background dark:bg-background/50"
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tags' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleCreateTag} className="flex gap-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag name (1-2 words)"
                  className="flex-1"
                />
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {tags.map(tag => (
              <Card key={tag.id} className="backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
                <CardContent className="p-4 flex justify-between items-center">
                  {editingTag?.id === tag.id ? (
                    <form onSubmit={handleUpdateTag} className="flex gap-2 flex-1">
                      <Input
                        type="text"
                        value={editingTag?.name || ''}
                        onChange={(e) => setEditingTag(editingTag ? { ...editingTag, name: e.target.value } : null)}
                        className="flex-1"
                      />
                      <Button type="submit" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTag(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="font-semibold">{tag.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTag({ id: tag.id, name: tag.name })}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
