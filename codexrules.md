Prompt for Codex/Cursor

You’re in a Next.js 14 (App Router) project using Supabase Auth. Make the following changes:

Goals

Nav visibility: Only show Dogs in the top nav when a user is signed in. Remove “Reports” from the nav entirely and move its content under the Dogs area.

Protect routes: If a user isn’t signed in and visits /dogs, redirect them to /sign-in.

Redirect old Reports URL: Visiting /reports should redirect to /dogs.

Clickable contact buttons: Make Call, Text, Email buttons tappable to:

Call: tel:+16104514099

Text: sms:+16104514099

Email: mailto:austinmck17@gmail.com

Center Walk Plans: Center-align the walk plan cards/section so they look balanced on the page.

Implementation details
A) Nav bar (client component)

Find the nav component that renders: Home, Walk Plans, Dogs, Reports, Sign In (likely components/NavBar.tsx or components/Header.tsx).

Convert it to a client component if it isn’t already ('use client').

Use Supabase client-side auth to conditionally render:

Always show: Home, Walk Plans.

Show Dogs only when user exists.

Remove “Reports” link entirely.

Show Sign In only when logged out (or Sign Out when logged in, if that already exists).

Replace the nav’s user logic with this pattern:

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

export default function NavBar() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="flex items-center gap-6">
      <Link href="/">Home</Link>
      <Link href="/walk-plans">Walk Plans</Link>
      {user && <Link href="/dogs">Dogs</Link>}
      {!user && <Link href="/sign-in">Sign In</Link>}
    </nav>
  );
}

B) Protect /dogs (server guard)

Use a server component/page guard so unauthenticated users can’t hit /dogs.

app/dogs/page.tsx

import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DogsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Render Dogs + Reports content here (see section C)
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Dogs</h1>
      {/* dogs list / add dog UI */}

      <section>
        <h2 className="text-2xl font-semibold">Reports</h2>
        {/* moved Reports content here */}
      </section>
    </div>
  );
}

C) Move “Reports” content under Dogs

Locate the current Reports page (e.g., app/reports/page.tsx or pages/reports/index.tsx).

Move its main JSX/content into the Reports section inside app/dogs/page.tsx (above).

Delete the old Reports page (or leave it empty if needed for redirects).

If there are shared components (e.g., components/ReportList.tsx), just import and render that component inside the Dogs page’s Reports section.

D) Redirect /reports → /dogs

Add a redirect in next.config.js (or extend the existing redirects):

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/reports', destination: '/dogs', permanent: false },
    ];
  },
};

module.exports = nextConfig;

E) Make Call/Text/Email buttons tappable

Find the “Call”, “Text”, “Email” buttons (likely on the home/hero or footer).

Convert them to anchor tags styled as buttons, with these exact hrefs:

<a href="tel:+16104514099" className="btn">Call</a>
<a href="sms:+16104514099" className="btn">Text</a>
<a href="mailto:austinmck17@gmail.com" className="btn">Email</a>


Keep existing styling classes (Tailwind or CSS) so they still look like buttons.

Do not add target="_blank" to tel: or sms: links.

F) Center-align the Walk Plans

Open the Walk Plans page (e.g., app/walk-plans/page.tsx) and/or the section on the home page where the “plan cards” render.

Ensure the wrapping container centers the cards horizontally across breakpoints. If using Tailwind, prefer this pattern:

<div className="mx-auto max-w-6xl px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
    {/* plan cards here */}
  </div>
</div>


If it’s using flex instead of grid, use:

<div className="flex flex-wrap justify-center gap-6 mx-auto max-w-6xl px-4">
  {/* plan cards here */}
</div>


Also ensure card text alignment is appropriate (e.g., text-center on headings if desired).

Cleanup & tests

Remove the “Reports” item from any secondary navs/footers too.

Build locally: npm run build and fix any imports from the removed Reports page.

QA:

Logged out: nav shows Home, Walk Plans, Sign In. Visiting /dogs redirects to /sign-in.

Logged in: nav shows Dogs; /dogs loads and contains the former Reports content.

/reports redirects to /dogs.

Call/Text/Email buttons open the dialer, SMS, and default mail client respectively.

Walk Plans grid/cards are centered on desktop and mobile.

Finally, commit changes with a message like:

feat(nav,dogs): hide Dogs unless signed in, remove Reports, move Reports under Dogs; add /reports→/dogs redirect; make contact buttons tappable; center Walk Plans