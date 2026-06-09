import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { SettingsPage } from "@/components/SettingsPage";

export default async function SettingsPageRoute() {
  try {
    const session = await getServerSession();

    if (!session) {
      redirect("/");
    }

    return <SettingsPage user={session} />;
  } catch (error) {
    console.error('Failed to load settings page:', error);
    redirect("/");
  }
}
