import { MdSportsSoccer, MdBusinessCenter, MdSchool } from "react-icons/md";
import featuresImage from "@/assets/landing/alt-features.png";

const Features = () => {
  const features = [
    {
      title: "Instant Venue Booking",
      icon: MdSportsSoccer,
    },
    {
      title: "Split Costs with Friends",
      icon: MdSportsSoccer,
    },
    {
      title: "Game History Tracking",
      icon: MdSportsSoccer,
    },
    {
      title: "Smart Venue Management",
      icon: MdBusinessCenter,
    },
    {
      title: "Revenue & Booking Analytics",
      icon: MdBusinessCenter,
    },
    {
      title: "Coach & Academy Support",
      icon: MdSchool,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-white via-[#00425b]/5 to-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-20">
          <span className="inline-block px-5 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-full">
            Features
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">
            <span className="bg-primary bg-clip-text text-transparent">
              Powerful Features for Everyone
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Designed to simplify bookings, empower venue owners, and elevate the
            sports experience.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src={featuresImage}
              alt="Platform Features"
              className="max-w-md w-full"
            />
          </div>

          {/* Right Feature List */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="text-primary w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {feature.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
