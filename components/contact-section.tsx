"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Twitter, Instagram, Youtube,Linkedin } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider title-text">Contact Us</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Email</h4>
                    <p className="text-gray-400">nexus@sahyadri.edu.in</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Phone</h4>
                    <p className="text-gray-400">+91 6361 741 473</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Location</h4>
                    <p className="text-gray-400">
                    Sahyadri Campus, Adyar
                      <br />
                       Mangaluru, Karnataka
                       <br/>
                       India - 575007
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <h4 className="text-lg font-medium mb-4 text-center">Connect With Us</h4>
                <div className="flex justify-center space-x-6">
                <a href="https://www.linkedin.com/company/nexus-sahyadri" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/nexus.sahyadri" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://www.youtube.com/@nexus.sahyadri" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

