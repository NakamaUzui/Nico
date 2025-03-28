"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function BestsellersHero() {
  const [scrollY, setScrollY] = useState(0)

  // Scroll-Position für Parallax-Effekt verfolgen
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Text-Animation Varianten
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Text für Buchstaben-Animation aufteilen
  const title = "BESTSELLERS"
  const letters = Array.from(title)

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <motion.div
        style={{ y: scrollY * 0.5 }} // Parallax-Effekt
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury vintage car"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
      />

      <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
        <motion.div variants={textVariants} initial="hidden" animate="visible" className="overflow-hidden">
          <div className="flex space-x-2 md:space-x-4">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-white text-3xl md:text-5xl font-light tracking-widest inline-block"
                whileHover={{
                  scale: 1.2,
                  color: "#E8DCCA",
                  transition: { duration: 0.2 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="h-[2px] bg-white mt-4"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-white mt-4 max-w-md text-sm md:text-base"
          >
            Discover our curated collection of timeless luxury pieces that define the old money aesthetic.
          </motion.p>
        </motion.div>
      </div>

      {/* Dekorative Elemente */}
      <motion.div
        className="absolute bottom-8 right-8 w-20 h-20 border border-white/30 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      />
      <motion.div
        className="absolute top-8 right-16 w-12 h-12 border border-white/30 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      />
    </div>
  )
}

