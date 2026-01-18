import promoImg from "@/assets/landing/Secure login-rafiki.svg";

const PromoContent = () => {
  return (
    <div className="max-w-lg mx-auto text-center lg:text-left">
      {/* Heading */}
      <h1 className="pt-6 text-4xl sm:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
        Book Sports
        <span className="block text-primary"> Venues in your city</span>
      </h1>{" "}
      <p className="mt-5 max-w-lg text-base sm:text-lg text-gray-600 leading-relaxed">
        Discover, book, and play at top-rated sports venues with real-time
        availability, secure payments, and instant confirmations.
      </p>
      {/* Image */}
      <div className="mt-0 flex justify-center lg:justify-start">
        <img
          src={promoImg}
          alt="Book sports venues"
          className="
            w-full
            max-w-xs
            sm:max-w-sm
            md:max-w-md
            lg:max-w-lg
            h-auto
            object-contain
          "
        />
      </div>
    </div>
  );
};

export default PromoContent;
