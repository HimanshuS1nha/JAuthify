import ContactSection from "@/components/home/contact-section";
import FeaturesSection from "@/components/home/features-section";
import HeroSection from "@/components/home/hero-section";

const HomePage = () => {
  return (
    <div className="py-10">
      <HeroSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
