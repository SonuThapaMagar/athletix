import heroBg from "@/assets/landing/hero-bg.svg";
import landingImage from "@/assets/landing/land.png";

interface HeroProps {
  onSignup?: () => void;
}
const Hero = ({ onSignup }: HeroProps = {}) => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Illustration */}
      <div
        className="absolute inset-0 bg-no-repeat bg-bottom bg-contain lg:bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 z-10" />

      {/* Content + Right Image */}
      <div className="relative z-20 flex flex-col-reverse lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-1 lg:pt-40">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-left ">
          <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight text-[#566581]">
            Where Players <br /><span className="text-primary">Meet the Game.</span>
          </h1>

          <p className="mt-6 text-primary/90 text-lg max-w-md">
            Create teams, book venues, and connect with players — all in one
            platform.
          </p>

          <button
            onClick={onSignup}
            className="mt-10 px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-end pt-10 lg:pt-0">
          <img
            src={landingImage}
            alt="Landing Illustration"
            className="w-full max-w-lg -scale-x-100"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
