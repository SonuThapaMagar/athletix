import footballImg from "@/assets/player/football.jpg";
import basketballImg from "@/assets/player/basketball.jpg";
import tennisImg from "@/assets/player/tennis.jpg";
import swimmingImg from "@/assets/player/swimming.jpg";
import cricketImg from "@/assets/player/cricket.jpg";
import badmintonImg from "@/assets/player/badminton.jpg";

interface Game {
  name: string;
  imgSrc: string;
}
const games: Game[] = [
  { name: "Football", imgSrc: footballImg },
  { name: "Basketball", imgSrc: basketballImg },
  { name: "Tennis", imgSrc: tennisImg },
  { name: "Swimming", imgSrc: swimmingImg },
  { name: "Cricket", imgSrc: cricketImg },
  { name: "Badminton", imgSrc: badmintonImg },
];

const Discover = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary/20 rounded-2xl">
      <h2 className="text-3xl font-bold text-[#1061dc] mb-6">
        Discover <span className="text-black">Games</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {games.map((game) => (
          <div
            key={game.name}
            className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={game.imgSrc}
              alt={game.name}
              className="w-full h-32 sm:h-40 md:h-36 lg:h-40 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-primary font-semibold text-lg">{game.name}</p>
            </div>

            <div className="p-2 text-center bg-white rounded-b-2xl">
              <p className="text-gray-800 font-medium">{game.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discover;
