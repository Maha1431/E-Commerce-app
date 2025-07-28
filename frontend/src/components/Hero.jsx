import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';

const Hero = () => {
  const images = [
    assets.hero_img,
    assets.hero_img1,
    assets.hero_img2,
    assets.hero_img3,
    assets.hero_img4,
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative rounded-xl overflow-hidden">
      {/* Offer Section */}
      <div className="relative w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-2 px-4 rounded-t-xl overflow-hidden h-[40px] sm:h-[50px] flex items-center mb-2 sm:mb-4">
        <div className="absolute whitespace-nowrap animate-marquee">
          <span className="text-xs sm:text-sm md:text-base font-medium">
            🔥 20% OFF on All Fashion Items! Limited time offer. Shop now and save big! 🔥
          </span>
        </div>
      </div>

      {/* Hero Image Carousel */}
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px]">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`carousel-${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
