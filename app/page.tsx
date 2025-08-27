"use client"

import { Suspense, useState } from "react"
import SplashScreen from "@/components/splash-screen"
import HomeScreen from "@/components/home-screen"
import AboutSection from "@/components/about-section"
import FeaturesSection from "@/components/features-section"
import TeamSection from "@/components/team-section"
import ContactSection from "@/components/contact-section"
import CinematicFooter from "@/components/cinematic-footer"
import Navbar from "@/components/navbar"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

export default function Home() {
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const { isMobile } = useMobileDetection()

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // If on mobile, the MobileDetectionWrapper will handle showing the mobile splash screen
  // This component will not be rendered on mobile devices

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Suspense fallback={<div className="w-full h-screen bg-black" />}>
        {showSplashScreen && <SplashScreen onComplete={() => setShowSplashScreen(false)} />}
        <Navbar onShowSplashScreen={handleShowSplashScreen} onNavigate={scrollToSection} />
        <HomeScreen />
        <AboutSection />
        <FeaturesSection />
        <TeamSection />
        <ContactSection />
        <CinematicFooter />
      </Suspense>
    </main>
  )

  function handleShowSplashScreen() {
    setShowSplashScreen(true)
  }
}

