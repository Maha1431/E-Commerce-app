import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import FAQ from '../components/Faq';
import Support from '../components/Support';

const Contact = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200); // slight delay for layout to fully render
      }
    }
  }, [location]);

  return (
    <div>
      {/* Page Title */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Contact Info Section */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20 px-4'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="Contact" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            54709 Willms Station <br />
            Suite 350, Washington, USA
          </p>
          <p className='text-gray-500'>
            Tel: (415) 555-0132 <br />
            Email: admin@forever.com
          </p>

          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Google Map */}
       <div className="px-4 mb-20">
        <iframe
          title="Our Store Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.4222152026077!2d-122.33439562371527!3d47.60383247119644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5490102d5177b0c7%3A0x39c2b12d14cf3044!2sWashington%2C%20USA!5e0!3m2!1sen!2sin!4v1659487223047!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
      {/* FAQ Section */}
      <div id="faq" className="px-4 mb-20">
        <FAQ />
      </div>

      {/* Support Section */}
      <div id="support" className="px-4 mb-20">
        <Support />
      </div>
    </div>
  );
};

export default Contact;
