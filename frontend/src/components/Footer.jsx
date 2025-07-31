import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='bg-blue-900 text-white'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-16 px-6 sm:px-12'>
        {/* Logo + Description */}
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Logo" />
          <p className='w-full md:w-2/3 text-white/80'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-semibold mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-white/80'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-xl font-semibold mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-white/80'>
            <li>+1-212-456-7890</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='bg-blue-950'>
        <hr className='border-white/30' />
        <p className='py-5 text-center text-sm text-white/70'>Copyright © 2024 forever.com — All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
