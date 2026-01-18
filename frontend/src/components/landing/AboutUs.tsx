import aboutImg from "@/assets/landing/features.png";
import aboutBg from "@/assets/landing/hero-bg.png";

const AboutUs = () => {
  return (
    <section id="about-us" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Image */}
      <img
        src={aboutBg}
        alt="Athletix background"
        className="absolute inset-0 w-full h-full object-cover"
      />


      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
          {/* LEFT – Text */}
          <div className="xl:col-span-7 order-2 xl:order-1">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
             Simplifying sports venue
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8">
             About Us
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
              Athletix is a modern sports venue booking platform designed to
              connect players, teams, and sports facilities in one seamless
              ecosystem. We eliminate the hassle of manual bookings by offering
              real-time availability, instant confirmations, and secure online
              payments — all in a single platform.
              <br />
              <br />
              Whether you're organizing a casual match, managing team practice,
              or exploring new sports venues, Athletix empowers you to focus on
              the game while we handle the logistics. Our mission is to make
              sports more accessible, organized, and connected for everyone.
            </p>
          </div>

          {/* RIGHT – Image */}
          <div className="xl:col-span-5 order-1 xl:order-2 flex justify-center">
            <img
              src={aboutImg}
              alt="Athletix platform preview"
              className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
