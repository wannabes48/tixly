import AboutUsSection from "@/components/ui/about-us-section";

export const metadata = {
  title: "About Us - Tixly",
  description: "Learn more about Tixly and our mission to connect fans with World Cup 2026 tickets.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      <AboutUsSection />
    </main>
  );
}
