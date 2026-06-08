import { getPostsByAuthor } from '@/lib/db';
import { parseTags } from '@/lib/utils';

interface ProfilePageProps {
  user: any;
}

export async function ProfilePage({ user }: ProfilePageProps) {
  const posts = await getPostsByAuthor(user.id);

  const postsWithTags = posts.map(post => ({
    ...post,
    tags: parseTags(post.tags)
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="border rounded-lg p-6 mb-8 backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
        <div className="flex items-center gap-6">
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>
            {user.pronouns && <p className="text-sm text-gray-500">{user.pronouns}</p>}
            {user.bio && <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Posts by @{user.username}</h2>

      <div className="grid gap-6">
        {postsWithTags.map((post: any) => (
          <div key={post.id} className="border rounded-lg p-6 backdrop-blur-sm bg-white/50 dark:bg-black/50" style={{ borderRadius: '24px' }}>
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{post.description}</p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag: any) => (
                  <span key={tag.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>👍 {post.upvotes}</span>
              <span>👎 {post.downvotes}</span>
              <span>👁️ {post.views}</span>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}
    </div>
  );
}
