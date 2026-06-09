import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { AdminPanel } from "@/components/AdminPanel";

export default async function AdminPage() {
  try {
    const session = await getServerSession();

    if (!session || !session.isAdmin) {
      redirect("/");
    }

    return <AdminPanel />;
  } catch (error) {
    console.error('Failed to load admin page:', error);
    redirect("/");
  }
}
