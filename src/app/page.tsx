import { PostCard } from "@/components/PostCard";
import { getFilteredPosts, getAllTags } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { Search } from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string };
}) {
  const posts = await getFilteredPosts(searchParams.search, searchParams.tag ? parseInt(searchParams.tag) : undefined);
  const tags = await getAllTags();

  const postsWithTags = posts.map(post => ({
    ...post,
    tags: parseTags(post.tags)
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 tracking-tight">HostScout</h1>
        <p className="text-muted-foreground text-lg">Discover and review the best hosting providers</p>
      </div>

      <div className="flex justify-center mb-12">
        <form action="/" method="GET" className="relative w-full max-w-2xl">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-100 blur-sm animate-gradient"></div>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search a host..."
              className="relative w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-base focus:outline-none z-10"
            />
          </div>
        </form>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {postsWithTags.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No posts found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}
