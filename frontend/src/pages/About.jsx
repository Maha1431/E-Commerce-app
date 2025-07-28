import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [location]);

  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
          <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          <b id="mission" className='text-gray-800'>Our Mission</b>
          <p>Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
        </div>
      </div>

      {/* TEAM SECTION */}
      <div id="team" className='text-2xl text-center pt-12 border-t'>
        <Title text1={'OUR'} text2={'TEAM'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-10 justify-center items-center text-center px-4'>
        <div className='border p-6 rounded-lg shadow-md w-full max-w-xs'>
          <img src="https://randomuser.me/api/portraits/women/79.jpg" alt="Priya Sharma" className='w-32 h-32 mx-auto rounded-full object-cover' />
          <h3 className='mt-4 font-semibold text-gray-800'>Priya Sharma</h3>
          <p className='text-sm text-gray-600'>Founder & CEO</p>
        </div>
        <div className='border p-6 rounded-lg shadow-md w-full max-w-xs'>
          <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="Rahul Verma" className='w-32 h-32 mx-auto rounded-full object-cover' />
          <h3 className='mt-4 font-semibold text-gray-800'>Rahul Verma</h3>
          <p className='text-sm text-gray-600'>Head of Design</p>
        </div>
        <div className='border p-6 rounded-lg shadow-md w-full max-w-xs'>
          <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sneha Kapoor" className='w-32 h-32 mx-auto rounded-full object-cover' />
          <h3 className='mt-4 font-semibold text-gray-800'>Sneha Kapoor</h3>
          <p className='text-sm text-gray-600'>Marketing Lead</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About;
