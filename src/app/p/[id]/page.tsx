import { notFound } from "next/navigation";
import { getPostById, incrementPostViews } from "@/lib/db";
import { PostDetail } from "@/components/PostDetail";
import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
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
  } catch (error) {
    console.error('Failed to generate metadata for post:', error);
    return {
      title: "Post",
    };
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id);

    if (!post) {
      notFound();
    }

    const session = await getServerSession();
    try {
      await incrementPostViews(params.id, session?.id);
    } catch (error) {
      console.error('Failed to increment post views:', error);
    }

    return <PostDetail post={post} />;
  } catch (error) {
    console.error('Failed to load post:', error);
    notFound();
  }
}
