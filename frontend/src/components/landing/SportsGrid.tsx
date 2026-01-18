import {
  MdSportsSoccer,
  MdSportsCricket,
  MdSportsTennis,
  MdSportsBasketball,
  MdPool,
  MdSportsBaseball,
} from "react-icons/md";

const SportsGrid = () => {
  const sports = [
    {
      name: "Football",
      icon: MdSportsSoccer,
      description: "Book premium football turfs and grounds near you.",
    },
    {
      name: "Cricket",
      icon: MdSportsCricket,
      description: "Find well-maintained cricket grounds with ease.",
    },
    {
      name: "Tennis",
      icon: MdSportsTennis,
      description: "Indoor and outdoor tennis courts available.",
    },
    {
      name: "Badminton",
      icon: MdSportsBaseball,
      description: "Reserve professional badminton courts instantly.",
    },
    {
      name: "Basketball",
      icon: MdSportsBasketball,
      description: "Book basketball courts for practice or matches.",
    },
    {
      name: "Swimming",
      icon: MdPool,
      description: "Access clean and safe swimming pools nearby.",
    },
  ];

  return (
    <section
      id="sports"
      className="py-20 bg-primary/10 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Sports Categories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Book Venues Across Multiple Sports
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Athletix lets you discover, compare, and book sports venues effortlessly — all in one platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport) => (
            <div
              key={sport.name}
              className="group bg-white rounded-2xl border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary transition-colors">
                <sport.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {sport.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {sport.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportsGrid;
