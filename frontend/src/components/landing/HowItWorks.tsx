import { MdSearch, MdCompare, MdPayment } from "react-icons/md";

type HowItWorksProps = {
  onSignup: () => void;
};

const steps = [
  {
    title: "Search",
    desc: "Find sport & location",
    icon: MdSearch,
    position: "top-[5%] left-[10%]",
  },
  {
    title: "Compare",
    desc: "Check availability",
    icon: MdCompare,
    position: "top-[35%] right-[10%]",
  },
  {
    title: "Book & Play",
    desc: "Pay & enjoy the game",
    icon: MdPayment,
    position: "top-[65%] left-[15%]",
  },
];

const HowItWorks = ({ onSignup }: HowItWorksProps) => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-white via-primary/5 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900">
            Your <span className="text-primary">Journey</span> Starts Here
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            From discovery to game time — all in a few simple steps.
          </p>
        </div>

        {/* Roadmap Container */}
        <div className="relative h-[700px] hidden lg:block">
          {/* Curved Road SVG */}
          <svg
            viewBox="0 0 600 700"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <path
              d="M300 0 C100 150, 100 300, 300 350 C500 400, 500 550, 300 700"
              stroke="#3787E4"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="8 14"
            />
          </svg>

          {/* Steps on Road */}
          {steps.map((step, index) => (
            <div
              key={index}
              className={`absolute ${step.position} w-72`}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 flex items-start gap-4 hover:-translate-y-2 transition">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br bg-primary flex items-center justify-center text-white">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile fallback */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={onSignup}
            className="px-12 py-4 rounded-2xl cursor-pointer bg-primary text-white font-bold shadow-xl hover:scale-105 transition"
          >
            Sign Up for Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
