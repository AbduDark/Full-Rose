import React from 'react'
import HeroSection from '../components/home/HeroSection'
import PopularCoursesSection from '../components/home/PopularCoursesSection'
import FeaturesSection from '../components/home/FeaturesSection'
import ReviewSection from '../components/home/ReviewSection'
function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCoursesSection />
      <FeaturesSection />
      <ReviewSection />
    </>
  )
}

export default HomePage
