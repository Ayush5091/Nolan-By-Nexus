"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { NexusLogo } from "@/components/nexus-logo"
import { Instagram, Twitter, Youtube, Facebook, ChevronUp } from "lucide-react"

export default function CinematicFooter() {
  const footerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer ref={footerRef} className="relative overflow-hidden pt-20 pb-10 bg-black font-montserrat">
      {/* Centered Nexus logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-96 h-96">
          <NexusLogo />
        </div>
      </div>

      {/* Film strip top border */}
      <div className="film-strip-border">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="film-hole"></div>
        ))}
      </div>

      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none"></div>

      {/* Film grain effect is added via CSS */}

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <motion.div style={{ opacity, y }} className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-16">
          {/* Logo and tagline */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-2xl tracking-wider" style={{ fontFamily: "var(--font-montserrat)" }}>
                NOLAN
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming imagination into cinematic reality through the power of AI.
            </p>
            {/*<div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>*/}
          </div>
        </motion.div>

        {/* Film reel animation - positioned to not overlap with text */}
        <div className="film-reel-container">
          <div className="film-reel"></div>
          <div className="film-reel-shadow"></div>
        </div>

        {/* Credits style bottom section */}
        <div className="pt-8 mt-8 border-t border-white/10 credits-section">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="credits-text"
            >
              <span className="block text-center md:text-left">© {currentYear} NOLAN. All Rights Reserved.</span>
              <div className="flex space-x-4 mt-2 justify-center md:justify-start">
                <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll to top button */}
        <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Scroll to top">
          <ChevronUp size={20} />
        </button>
      </div>

      {/* Film strip bottom border */}
      <div className="film-strip-border bottom-0">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="film-hole"></div>
        ))}
      </div>
    </footer>
  )
}

