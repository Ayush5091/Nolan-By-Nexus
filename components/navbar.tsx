"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { NexusLogo } from "@/components/nexus-logo"

const navItems = [
  { name: "HOME", href: "home" },
  { name: "ABOUT", href: "about" },
  { name: "FEATURES", href: "features" },
  { name: "TEAM", href: "team" },
  { name: "CONTACT", href: "contact" },
]

// Add props for navigation and splash screen
function Navbar({
  onShowSplashScreen,
  onNavigate,
}: {
  onShowSplashScreen?: () => void
  onNavigate?: (sectionId: string) => void
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(href)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 py-4 ${isScrolled ? "bg-black/50 backdrop-blur-md" : ""}`}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: isScrolled ? 0 : 0,
        opacity: 1,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo - Left side, not part of nav - only show when scrolled */}
          {isScrolled && (
            <button
              onClick={onShowSplashScreen}
              className="text-2xl font-bold tracking-wider text-white hover:text-white/90 transition-colors"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              NOLAN
            </button>
          )}

          {/* Centered Navigation - Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="glass rounded-lg px-8 py-2 flex items-center space-x-10 material-shadow backdrop-blur-md bg-white/5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="relative text-white/80 hover:text-white transition-colors group py-2 font-montserrat tracking-wider text-sm"
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300"
                    layoutId="underline"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Nexus Logo - Right side - only show when scrolled */}
          {isScrolled && (
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center w-10 h-10 text-white hover:opacity-80 transition-opacity"
            >
              <NexusLogo />
            </a>
          )}

          {/* Mobile Menu Button - Right side (only visible on mobile) */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden mt-4"
        >
          <div className="glass rounded-lg p-4 space-y-2 mx-auto max-w-xs backdrop-blur-md bg-white/5">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(item.href, e)}
                className="block text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-montserrat tracking-wider text-sm"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

// Export both as default and named export
export { Navbar }
export default Navbar

