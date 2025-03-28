"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/context/translation-context"

export default function AnnouncementBar() {
  const { translate } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  const announcements = [
    translate("CLEARANCE SALE - UP TO 50% OFF"),
    translate("FREE SHIPPING ON ORDERS OVER $150"),
    translate("NEW ARRIVALS - SPRING COLLECTION"),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [announcements.length])

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + announcements.length) % announcements.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length)
  }

  return (
    <div className="bg-black text-white py-3 relative overflow-hidden">
      <div className="flex justify-center items-center">
        <motion.button
          onClick={goToPrev}
          className="absolute left-4 text-white"
          aria-label="Previous announcement"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="text-center text-sm font-medium tracking-wider"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {announcements[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.button
          onClick={goToNext}
          className="absolute right-4 text-white"
          aria-label="Next announcement"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}

