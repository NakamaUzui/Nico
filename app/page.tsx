"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import BestsellersHero from "@/components/bestsellers-hero"
import ProductGrid from "@/components/product-grid"
import FilterSidebar, { type FilterState } from "@/components/filter-sidebar"
import AnnouncementBar from "@/components/announcement-bar"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export default function BestsellersPage() {
  const [sortOption, setSortOption] = useState("FEATURED")
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    inStockOnly: false,
    selectedSizes: [],
    selectedColors: [],
  })

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(smoothProgress, [0, 0.2], [0, -50])

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  // Verwenden von useCallback, um zu verhindern, dass die Funktion bei jedem Rendering neu erstellt wird
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  return (
    <main className="flex min-h-screen flex-col" ref={ref}>
      <AnnouncementBar />
      <div className="relative">
        <motion.div style={{ opacity, scale, y }}>
          <BestsellersHero />
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-serif mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Explore Our Collection
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              className="w-full lg:w-1/4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <FilterSidebar onFilterChange={handleFilterChange} />
            </motion.div>

            <motion.div
              className="w-full lg:w-3/4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.div
                className="flex justify-end mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort by:</span>
                  <select
                    className="border-none bg-transparent font-medium focus:ring-0"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option>FEATURED</option>
                    <option>PRICE: LOW TO HIGH</option>
                    <option>PRICE: HIGH TO LOW</option>
                    <option>NEWEST</option>
                    <option>BEST SELLING</option>
                  </select>
                </div>
              </motion.div>

              <ProductGrid filters={filters} sortOption={sortOption} />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating scroll indicator */}
        <motion.div
          className="fixed bottom-8 right-8 z-10 bg-black text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.div>
      </div>
    </main>
  )
}

