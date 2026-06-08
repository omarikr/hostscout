import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'hostscout.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      bio TEXT,
      pronouns TEXT,
      avatar TEXT,
      isAdmin INTEGER DEFAULT 0,
      isSuspended INTEGER DEFAULT 0,
      suspensionReason TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL,
      logo TEXT,
      authorId INTEGER NOT NULL,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      pinned INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      authorId INTEGER NOT NULL,
      content TEXT NOT NULL,
      parentId INTEGER,
      likes INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (authorId) REFERENCES users(id),
      FOREIGN KEY (parentId) REFERENCES comments(id)
    );

    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      postId INTEGER,
      commentId INTEGER,
      voteType INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (postId) REFERENCES posts(id),
      FOREIGN KEY (commentId) REFERENCES comments(id),
      UNIQUE(userId, postId),
      UNIQUE(userId, commentId)
    );

    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      commentId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (commentId) REFERENCES comments(id),
      UNIQUE(userId, commentId)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      postId INTEGER NOT NULL,
      tagId INTEGER NOT NULL,
      PRIMARY KEY (postId, tagId),
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(postId, userId)
    );
  `);

  // Add missing columns if they don't exist (migration for existing databases)
  try {
    db.prepare(`ALTER TABLE posts ADD COLUMN pinned INTEGER DEFAULT 0`).run();
  } catch (e) {
    // Column already exists, ignore error
  }

  // Create default admin if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('omaralt4747@gmail.com');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('OmarNasir7890', 10);
    db.prepare(`
      INSERT OR IGNORE INTO users (email, username, password, name, isAdmin)
      VALUES (?, ?, ?, ?, 1)
    `).run('omaralt4747@gmail.com', 'omaralt4747', hashedPassword, 'Omar Nasir');
  }
}

// User operations
export function createUser(email: string, username: string, password: string, name?: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (email, username, password, name)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(email, username, hashedPassword, name || username);
  return result.lastInsertRowid as number;
}

export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
}

export function getUserByUsername(username: string) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
}

export function getUserById(id: number) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
}

export function updateUser(id: number, data: { name?: string; bio?: string; pronouns?: string; avatar?: string; username?: string }) {
  const fields = [];
  const values = [];
  
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.bio !== undefined) { fields.push('bio = ?'); values.push(data.bio); }
  if (data.pronouns !== undefined) { fields.push('pronouns = ?'); values.push(data.pronouns); }
  if (data.avatar !== undefined) { fields.push('avatar = ?'); values.push(data.avatar); }
  if (data.username !== undefined) { fields.push('username = ?'); values.push(data.username); }
  
  if (fields.length === 0) return;
  
  values.push(id);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function suspendUser(id: number, reason: string) {
  db.prepare('UPDATE users SET isSuspended = 1, suspensionReason = ? WHERE id = ?').run(reason, id);
}

export function unsuspendUser(id: number) {
  db.prepare('UPDATE users SET isSuspended = 0, suspensionReason = NULL WHERE id = ?').run(id);
}

export function deleteUser(id: number) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export function getAllUsers() {
  return db.prepare('SELECT id, email, username, name, isAdmin, isSuspended, suspensionReason, createdAt FROM users ORDER BY createdAt DESC').all() as any[];
}

// Post operations
export function createPost(title: string, description: string, content: string, logo: string, authorId: number) {
  const stmt = db.prepare(`
    INSERT INTO posts (title, description, content, logo, authorId)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(title, description, content, logo, authorId);
  return result.lastInsertRowid as number;
}

export function getPosts() {
  return db.prepare(`
    SELECT p.*, u.username, u.name, u.avatar,
      (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount,
      (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
       JOIN post_tags pt ON t.id = pt.tagId 
       WHERE pt.postId = p.id) as tags
    FROM posts p
    JOIN users u ON p.authorId = u.id
    ORDER BY p.pinned DESC, p.createdAt DESC
  `).all() as any[];
}

export function getPostById(id: string) {
  return db.prepare(`
    SELECT p.*, u.username, u.name, u.avatar,
      (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
       JOIN post_tags pt ON t.id = pt.tagId 
       WHERE pt.postId = p.id) as tags
    FROM posts p
    JOIN users u ON p.authorId = u.id
    WHERE p.id = ?
  `).get(id) as any;
}

export function updatePost(id: string, data: { title?: string; description?: string; content?: string; logo?: string; pinned?: number }) {
  const fields = [];
  const values = [];
  
  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
  if (data.content !== undefined) { fields.push('content = ?'); values.push(data.content); }
  if (data.logo !== undefined) { fields.push('logo = ?'); values.push(data.logo); }
  if (data.pinned !== undefined) { fields.push('pinned = ?'); values.push(data.pinned); }
  
  if (fields.length === 0) return;
  
  values.push(id);
  db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deletePost(id: string) {
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
}

export function incrementPostViews(id: string, userId?: number) {
  // Check if user has already viewed this post
  if (userId) {
    const existingView = db.prepare('SELECT id FROM post_views WHERE postId = ? AND userId = ?').get(id, userId) as any;
    if (existingView) return; // Don't increment if already viewed
    // Record the view
    db.prepare('INSERT INTO post_views (postId, userId) VALUES (?, ?)').run(id, userId);
  }
  db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(id);
}

export function votePost(postId: string, userId: number, voteType: number) {
  const existing = db.prepare('SELECT * FROM votes WHERE userId = ? AND postId = ?').get(userId, postId) as any;
  
  if (existing) {
    if (existing.voteType === voteType) {
      db.prepare('DELETE FROM votes WHERE id = ?').run(existing.id);
      if (voteType === 1) db.prepare('UPDATE posts SET upvotes = upvotes - 1 WHERE id = ?').run(postId);
      else db.prepare('UPDATE posts SET downvotes = downvotes - 1 WHERE id = ?').run(postId);
    } else {
      db.prepare('UPDATE votes SET voteType = ? WHERE id = ?').run(voteType, existing.id);
      if (voteType === 1) {
        db.prepare('UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = ?').run(postId);
      } else {
        db.prepare('UPDATE posts SET downvotes = downvotes + 1, upvotes = upvotes - 1 WHERE id = ?').run(postId);
      }
    }
  } else {
    db.prepare('INSERT INTO votes (userId, postId, voteType) VALUES (?, ?, ?)').run(userId, postId, voteType);
    if (voteType === 1) db.prepare('UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?').run(postId);
    else db.prepare('UPDATE posts SET downvotes = downvotes + 1 WHERE id = ?').run(postId);
  }
}

// Comment operations
export function createComment(postId: string, authorId: number, content: string, parentId?: number) {
  const stmt = db.prepare(`
    INSERT INTO comments (postId, authorId, content, parentId)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(postId, authorId, content, parentId || null);
  return result.lastInsertRowid as number;
}

export function getCommentsByPostId(postId: string) {
  return db.prepare(`
    SELECT c.*, u.username, u.name, u.avatar
    FROM comments c
    JOIN users u ON c.authorId = u.id
    WHERE c.postId = ?
    ORDER BY c.createdAt ASC
  `).all(postId) as any[];
}

export function getCommentById(id: number) {
  return db.prepare('SELECT * FROM comments WHERE id = ?').get(id) as any;
}

export function updateComment(id: number, content: string) {
  db.prepare('UPDATE comments SET content = ? WHERE id = ?').run(content, id);
}

export function deleteComment(id: number) {
  // First, delete all replies recursively
  const replies = db.prepare('SELECT id FROM comments WHERE parentId = ?').all(id) as any[];
  for (const reply of replies) {
    deleteComment(reply.id);
  }
  // Then delete the comment itself
  db.prepare('DELETE FROM comments WHERE id = ?').run(id);
}

export function likeComment(commentId: number, userId: number) {
  const existing = db.prepare('SELECT * FROM comment_likes WHERE userId = ? AND commentId = ?').get(userId, commentId) as any;
  
  if (existing) {
    db.prepare('DELETE FROM comment_likes WHERE id = ?').run(existing.id);
    db.prepare('UPDATE comments SET likes = likes - 1 WHERE id = ?').run(commentId);
  } else {
    db.prepare('INSERT INTO comment_likes (userId, commentId) VALUES (?, ?)').run(userId, commentId);
    db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(commentId);
  }
}

export function getUserVote(userId: number, postId: string) {
  return db.prepare('SELECT voteType FROM votes WHERE userId = ? AND postId = ?').get(userId, postId) as any;
}

export function getUserCommentLike(userId: number, commentId: number) {
  return db.prepare('SELECT * FROM comment_likes WHERE userId = ? AND commentId = ?').get(userId, commentId) as any;
}

export function getPostsByAuthor(authorId: number) {
  return db.prepare(`
    SELECT p.*, 
      (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount,
      (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
       JOIN post_tags pt ON t.id = pt.tagId 
       WHERE pt.postId = p.id) as tags
    FROM posts p
    WHERE p.authorId = ?
    ORDER BY p.createdAt DESC
  `).all(authorId) as any[];
}

// Tag operations
export function createTag(name: string) {
  const stmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
  const result = stmt.run(name);
  return result.lastInsertRowid as number;
}

export function getAllTags() {
  return db.prepare('SELECT * FROM tags ORDER BY name').all() as any[];
}

export function getTagById(id: number) {
  return db.prepare('SELECT * FROM tags WHERE id = ?').get(id) as any;
}

export function updateTag(id: number, name: string) {
  db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(name, id);
}

export function deleteTag(id: number) {
  db.prepare('DELETE FROM tags WHERE id = ?').run(id);
}

export function assignTagToPost(postId: string, tagId: number) {
  const stmt = db.prepare('INSERT OR IGNORE INTO post_tags (postId, tagId) VALUES (?, ?)');
  stmt.run(postId, tagId);
}

export function removeTagFromPost(postId: string, tagId: number) {
  db.prepare('DELETE FROM post_tags WHERE postId = ? AND tagId = ?').run(postId, tagId);
}

export function getPostTags(postId: string) {
  return db.prepare(`
    SELECT t.* FROM tags t
    JOIN post_tags pt ON t.id = pt.tagId
    WHERE pt.postId = ?
  `).all(postId) as any[];
}

export function getPostsByTag(tagId: number) {
  return db.prepare(`
    SELECT p.*, u.username, u.name, u.avatar,
      (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount,
      (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
       JOIN post_tags pt ON t.id = pt.tagId 
       WHERE pt.postId = p.id) as tags
    FROM posts p
    JOIN users u ON p.authorId = u.id
    JOIN post_tags pt ON p.id = pt.postId
    WHERE pt.tagId = ?
    ORDER BY p.createdAt DESC
  `).all(tagId) as any[];
}

export function searchPosts(query: string) {
  return db.prepare(`
    SELECT p.*, u.username, u.name, u.avatar,
      (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount,
      (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
       JOIN post_tags pt ON t.id = pt.tagId 
       WHERE pt.postId = p.id) as tags
    FROM posts p
    JOIN users u ON p.authorId = u.id
    WHERE p.title LIKE ? OR p.description LIKE ?
    ORDER BY p.createdAt DESC
  `).all(`%${query}%`, `%${query}%`) as any[];
}

export function getFilteredPosts(searchQuery?: string, tagId?: number) {
  if (searchQuery && tagId) {
    return db.prepare(`
      SELECT p.*, u.username, u.name, u.avatar,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount,
        (SELECT GROUP_CONCAT(t.id || ':' || t.name, ',') FROM tags t 
         JOIN post_tags pt ON t.id = pt.tagId 
         WHERE pt.postId = p.id) as tags
      FROM posts p
      JOIN users u ON p.authorId = u.id
      JOIN post_tags pt ON p.id = pt.postId
      WHERE pt.tagId = ? AND (p.title LIKE ? OR p.description LIKE ?)
      ORDER BY p.createdAt DESC
    `).all(tagId, `%${searchQuery}%`, `%${searchQuery}%`) as any[];
  } else if (searchQuery) {
    return searchPosts(searchQuery);
  } else if (tagId) {
    return getPostsByTag(tagId);
  } else {
    return getPosts();
  }
}

// Initialize DB on import
initDB();
