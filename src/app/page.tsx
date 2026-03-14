import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import FeaturedContests from "@/components/sections/FeaturedContests";
import HowItWorks from "@/components/sections/HowItWorks";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedContests />
      <HowItWorks />
      <Footer />
    </main>
  );
}
