import React from 'react';
import Title from '../components/Title';
import { Mail, Phone, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Support = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your query has been submitted. We will get back to you soon.');
  };

  return (
    <div className='py-12 px-4 bg-gray-100 min-h-screen'>
      {/* Page Title */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CUSTOMER'} text2={'SUPPORT'} />
        <p className="text-gray-600 mt-4 text-sm">We’re here to help you with anything you need</p>
      </div>

      {/* Two Column Layout */}
      <div className='max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-10'>

        {/* Contact Info */}
        <div className='bg-white p-8 rounded-xl shadow-md space-y-6'>
          <div className='flex items-start gap-4'>
            <Mail className='text-gray-600 mt-1' />
            <div>
              <h4 className='font-semibold'>Email</h4>
              <p className='text-gray-600 text-sm'>support@forever.com</p>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <Phone className='text-gray-600 mt-1' />
            <div>
              <h4 className='font-semibold'>Phone</h4>
              <p className='text-gray-600 text-sm'>(415) 555-9876</p>
            </div>
          </div>

          <div className='flex items-start gap-4'>
            <Clock className='text-gray-600 mt-1' />
            <div>
              <h4 className='font-semibold'>Support Hours</h4>
              <p className='text-gray-600 text-sm'>Monday - Friday, 9AM - 6PM (PST)</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='bg-white p-8 rounded-xl shadow-md'>
          <h3 className='text-lg font-semibold mb-6'>Send us a message</h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type="text"
              placeholder="Your Name"
              required
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              required
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black'
            ></textarea>
            <button
              type="submit"
              className='w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition'
            >
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Support;
