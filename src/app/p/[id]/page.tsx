import { notFound } from "next/navigation";
import { getPostById, incrementPostViews } from "@/lib/db";
import { PostDetail } from "@/components/PostDetail";
import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPostById(params.id);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - HostScout`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const session = await getServerSession();
  await incrementPostViews(params.id, session?.id);

  return <PostDetail post={post} />;
}
