import {createSupabaseServer} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-4">Signed in as {user.email}</p>
          <div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

