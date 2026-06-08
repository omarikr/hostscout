import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/db";
import { ProfilePage } from "@/components/ProfilePage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const user = await getUserByUsername(params.username);
  
  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} (@${user.username}) - HostScout`,
    description: user.bio || `View ${user.name}'s profile on HostScout`,
  };
}

export default async function UserProfile({ params }: { params: { username: string } }) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  return <ProfilePage user={user} />;
}
