import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/db";
import { ProfilePage } from "@/components/ProfilePage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  try {
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
  } catch (error) {
    console.error('Failed to generate metadata for user:', error);
    return {
      title: "User Profile",
    };
  }
}

export default async function UserProfile({ params }: { params: { username: string } }) {
  try {
    const user = await getUserByUsername(params.username);

    if (!user) {
      notFound();
    }

    return <ProfilePage user={user} />;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    notFound();
  }
}
