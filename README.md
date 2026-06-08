# HostScout

A hosting review platform built with Next.js, TypeScript, Tailwind CSS, and SQLite3.

## Features

- **User Authentication**: Register and login with email/username, password validation, and Cloudflare Turnstile captcha
- **Hosting Reviews**: Create, view, and review hosting providers
- **Comment System**: Comment on posts with replies and @ mentions
- **Voting System**: Upvote/downvote posts and comments
- **User Profiles**: Customizable profiles with avatar, bio, and pronouns
- **Admin Panel**: Manage users, posts, comments, and tags
- **Tags System**: Create, edit, and delete tags; assign tags to posts; filter posts by tags
- **Search**: Search posts by name/description
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Clean UI optimized for all devices

## Default Admin Account

- **Email**: omaralt4747@gmail.com
- **Password**: OmarNasir7890
- **Username**: omaralt4747

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
DATABASE_URL=./hostscout.db
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database

The application uses SQLite3 with better-sqlite3. The database file is created automatically on first run.

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components
- `src/lib/` - Database and authentication utilities
- `public/` - Static assets

## URL Structure

- `/` - Home page with all posts, search, and tag filtering
- `/info` - About/landing page
- `/p/<id>` - Individual post page
- `/[username]` - User profile page
- `/admin` - Admin panel (admin only)
- `/settings` - Account settings
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Admin Features

- **Users Tab**: View all users, suspend/unsuspend accounts with reason, delete users
- **Posts Tab**: View all posts, delete posts
- **Create Post Tab**: Create new posts with title, description, content, logo, and tags
- **Tags Tab**: Create, edit, and delete tags (e.g., "free", "legitimate", "official")
