"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Film, Lightbulb, ImageIcon } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { useRouter } from "next/navigation"

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const router = useRouter()

  const features = [
    {
      icon: <Film className="w-12 h-12 text-white" />,
      title: "Media Related Trends",
      description: "Stay updated with the latest trends in filmmaking, cinematography, and storytelling techniques.",
      path: "/features/media-trends",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-white" />,
      title: "Directorial Insights",
      description: "Gain valuable insights into directorial choices, scene composition, and narrative structure.",
      path: "/features/directorial-insights",
    },
    {
      icon: <ImageIcon className="w-12 h-12 text-white" />,
      title: "Cinematic Image Generator",
      description: "Create stunning visuals with AI to complement your screenplay or storyboard.",
      path: "/image-generator",
    },
  ]

  const handleFeatureClick = (path: string) => {
    router.push(path)
  }

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-80 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider title-text">Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our powerful tools designed to enhance your screenwriting experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              onClick={() => handleFeatureClick(feature.path)}
              className="cursor-pointer"
            >
              <GlassCard
                className={`h-full p-8 text-center transition-all duration-300 ${hoveredFeature === index ? "bg-white/10" : ""}`}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  animate={hoveredFeature === index ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                <motion.button
                  className="mt-6 px-4 py-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                  animate={hoveredFeature === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  Explore
                </motion.button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

