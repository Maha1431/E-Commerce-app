import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import WhyChoose from '../components/WhyChoose'
import SpecialOffers from '../components/SpecialOffers'
import EthnicWear from '../components/EthinicWear'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <SpecialOffers/>
      <EthnicWear/>
      <OurPolicy/>
      <NewsletterBox/>
      <WhyChoose/>
    </div>
  )
}

export default Home
