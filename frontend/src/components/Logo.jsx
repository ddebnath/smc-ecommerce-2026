import logo from "@/assets/college_logo.png"; // update path

const Logo = () => {
  return (
    <div className="flex justify-items-stretch gap-3 cursor-pointer group">
      {/* Logo Image */}
      <img
        src={logo}
        alt="SMC Store Logo"
        className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      />

      {/* Brand Name */}
      <h1 className="text-xl font-semibold text-gray-800 transition group-hover:text-purple-600">
        Saint Mary's College Online Store
      </h1>
    </div>
  );
};

export default Logo;
