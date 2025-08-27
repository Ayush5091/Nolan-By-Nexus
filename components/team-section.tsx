"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Twitter, Linkedin, Github } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

export default function TeamSection() {
  // State removed as it's no longer needed
  const containerRef = useRef<HTMLDivElement>(null)

  const teamMembers = [
    {
      name: "Krish",
      role: "Writer Module Developer",
      bio: "Responsible for creating Nolan’s Writer module using AI for cinematic content creation.",
      image: "/krishlinkedin.png",
      social: [
        /*{ icon: <Twitter size={18} />, url: "#" },*/
        { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/krish-chowta-048bb1280?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" },
       /* { icon: <Github size={18} />, url: "#" },*/
      ],
    },
    {
      name: "Ayush",
      role: "UI/UX Designer",
      bio: "Crafted Nolan’s modern UI/UX, blending storytelling flow with aesthetic design.",
      image: "/ayush.png",
      social: [
       /* { icon: <Twitter size={18} />, url: "#" },*/
        { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/ayush-narayan-2396272a3/" },
       /* { icon: <Github size={18} />, url: "#" },*/
      ],
    },
    {
      name: "Advaith",
      role: "Critic System Developer",
      bio: "Designed the Critic system for Nolan using ML and Storytelling Principles.",
      image: "/adwait.png",
      social: [
        /*{ icon: <Twitter size={18} />, url: "#" },*/
        { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/advaith-shajeendran-9a2847287/" },
       /* { icon: <Github size={18} />, url: "#" },*/
      ],
    },
  ]

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-80 z-0"></div>

      <div className="container mx-auto px-4 relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider title-text">Our Team</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">Meet the creative minds behind NOLAN</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="team-card relative"
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <GlassCard className="h-full p-6 text-center relative overflow-hidden">
                <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    style={{ pointerEvents: "none" }} // Prevent image download
                  />
                </div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-white/60 mb-4">{member.role}</p>
                <p className="text-gray-300 mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  {member.social.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      className="social-icon w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white/80 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

