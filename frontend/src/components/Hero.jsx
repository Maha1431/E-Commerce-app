import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  const images = [
    // assets.image10,
    // assets.image2,
    // assets.hero_img1,
    // assets.image6,
    // assets.hero_img2,
    // assets.hero_img3,
    // assets.image1,
    assets.banner_img,
    assets.banner_img1,
    assets.banner_img2,
    assets.banner_img3,
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden">
      {/* Offer Banner */}
      <div className="relative w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-2 px-4 rounded-t-xl overflow-hidden h-[40px] sm:h-[50px] flex items-center mb-2 sm:mb-4">
        <div className="absolute whitespace-nowrap animate-marquee">
          <span className="text-xs sm:text-sm md:text-base font-medium">
            🔥 20% OFF on All Fashion Items! Limited time offer. Shop now and
            save big! 🔥
          </span>
        </div>
      </div>

      {/* Responsive Hero Image Carousel */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/6] lg:aspect-[16/5] overflow-hidden">
        {images.map((img, index) => (
          <img
            key={`hero-img-${index}`}
            src={img}
            alt={`carousel-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
