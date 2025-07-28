import React from 'react';
import Title from '../components/Title';

const FAQ = () => {
  return (
    <div className='py-12 px-4'>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'FREQUENTLY'} text2={'ASKED QUESTIONS'} />
      </div>
      <div className='max-w-3xl mx-auto mt-10 space-y-6 text-gray-700'>
        <div>
          <h3 className='font-semibold'>Q: How can I track my order?</h3>
          <p>A: You can track your order using the tracking number sent to your email.</p>
        </div>
        <div>
          <h3 className='font-semibold'>Q: What is your return policy?</h3>
          <p>A: We accept returns within 14 days. Items must be unused and with original tags.</p>
        </div>
        {/* Add more FAQs as needed */}
      </div>
    </div>
  );
};

export default FAQ;
