import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lens } from '@/components/ui/lens';
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Tag } from 'lucide-react';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    description: string;
    logo: string;
    upvotes: number;
    downvotes: number;
    views: number;
    commentCount: number;
    username: string;
    createdAt: string;
    tags?: { id: number; name: string }[];
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/p/${post.id}`}>
      <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto dark:bg-gradient-to-br dark:from-[#1D2235] dark:to-[#121318] bg-gradient-to-br from-gray-100 to-gray-200 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-border">
        <div className="relative z-10">
          {post.logo && (
            <Lens isStatic>
              <img
                src={post.logo}
                alt={post.title}
                width={500}
                height={500}
                className="rounded-2xl w-full h-56 object-cover"
              />
            </Lens>
          )}
          <div className="py-4 relative z-20">
            <h2 className="dark:text-white text-gray-900 text-xl text-left font-bold mb-2 line-clamp-1">
              {post.title}
            </h2>
            <p className="dark:text-neutral-200 text-gray-700 text-left line-clamp-2 text-sm">
              {post.description}
            </p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag.id} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 text-xs dark:text-neutral-300 text-gray-600">
            <span className="font-medium">by @{post.username}</span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> {post.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsDown className="h-3 w-3" /> {post.downvotes}
            </span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> {post.commentCount}
            </span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {post.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
