import Navigation from "@/components/Navigation";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-16 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p>We collect location data only during active walks that you start and end.</p>
        <p>For each walk we store the GPS points, total distance, and duration.</p>
        <p>You may request deletion of this information at any time by emailing us.</p>
      </main>
    </div>
  );
}
