import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import SportsGrid from "@/components/landing/SportsGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/common/Footer";

const LandingPage = () => {

  return (
    <div className="min-h-dvh flex flex-col">
      <Header onLogin={() => (window.location.href = '/login')} onSignup={() => (window.location.href = '/signup')} />
      <Hero onLogin={() => (window.location.href = '/login')} onSignup={() => (window.location.href = '/signup')} />
      <Features />
      <SportsGrid />
      <HowItWorks onSignup={() => (window.location.href = '/signup')} />
      <Footer />
    </div>
  );
};

export default LandingPage;
