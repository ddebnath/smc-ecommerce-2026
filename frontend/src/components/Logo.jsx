import { Cake, Music, Gem } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-4 cursor-pointer group">
      {/* Icon Container */}
      <div className="flex items-center justify-center rounded-full gap-4 bg-purple-600 p-2 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-700">
        <Cake className="h-6 w-6 text-white transition-all duration-300 group-hover:-translate-y-1" />

        <Gem className="h-6 w-6 text-white -ml-1 transition-all duration-300 group-hover:scale-125" />

        <Music className="h-6 w-6 text-white -ml-1 transition-all duration-300 group-hover:translate-x-1" />
      </div>

      {/* Brand Name */}
      <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-purple-600 group-hover:tracking-wide">
        SMC <span className="text-white">Store</span>
      </h1>
    </div>
  );
};

export default Logo;
