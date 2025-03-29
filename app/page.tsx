"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import BestsellersHero from "@/components/bestsellers-hero"
import ProductGrid from "@/components/product-grid"
import FilterSidebar, { type FilterState } from "@/components/filter-sidebar"
import AnnouncementBar from "@/components/announcement-bar"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useStore } from "@/context/store-context"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { translate } from "@/utils/translate"
import LanguageSwitcher from "@/components/language-switcher"

const slides = [
  {
    image: "/image.png",
    title: "Classic Trench Collection",
    subtitle: "Timeless Elegance for Every Season",
    cta: "Shop Collection"
  },
  {
    image: "/image2.png",
    title: "New Arrivals",
    subtitle: "Discover Our Latest Styles",
    cta: "View New"
  },
  {
    image: "/image3.png",
    title: "Premium Quality",
    subtitle: "Crafted with Excellence",
    cta: "Learn More"
  }
]

export default function BestsellersPage() {
  const { addToCart } = useStore()
  const { toast } = useToast()
  const [sortOption, setSortOption] = useState("FEATURED")
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    inStockOnly: false,
    selectedSizes: [],
    selectedColors: [],
  })
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const { language } = useLanguage()

  // Smooth scroll to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Verwenden von useCallback, um zu verhindern, dass die Funktion bei jedem Rendering neu erstellt wird
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleAddToCart = (piece: { id: string; name: string; price: number; image: string }) => {
    addToCart(piece)
    toast({
      title: translate("Added to Cart!", language),
      description: `${piece.name} ${translate("has been added to your cart.", language)}`,
      duration: 2000,
    })
  }

  return (
    <main className="flex min-h-screen flex-col" ref={ref}>
      <AnnouncementBar />
      <div className="relative">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Hero Section with Slideshow */}
        <section className="relative h-[80vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full"
            >
              <Image
                src={slides[currentSlide].image}
                alt={translate(slides[currentSlide].title, language)}
                fill
                className="object-cover object-center"
                priority
                quality={100}
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-serif mb-4"
                >
                  {translate(slides[currentSlide].title, language)}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl mb-8"
                >
                  {translate(slides[currentSlide].subtitle, language)}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300 text-lg font-medium"
                  >
                    {translate(slides[currentSlide].cta, language)}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? "w-8 bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-serif mb-4">{translate("Trending Now", language)}</h2>
              <p className="text-gray-600">{translate("Discover our most popular styles", language)}</p>
            </motion.div>

            <div className="relative overflow-hidden">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "calc(-100% + 100vw)" }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 15,
                    ease: "linear"
                  }
                }}
                className="flex gap-6"
              >
                {/* Classic Piece 1 */}
                <motion.div
                  className="relative w-[300px] flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/image.png"
                      alt="Classic Piece 1"
                      fill
                      className="object-cover object-center"
                      sizes="300px"
                      quality={100}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          Trending
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          New
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Classic Piece 1</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">$299.99</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white rounded-full text-black"
                          onClick={() => handleAddToCart({
                            id: "classic-piece-1",
                            name: "Classic Piece 1",
                            price: 299.99,
                            image: "/image.png"
                          })}
                        >
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Classic Piece 2 */}
                <motion.div
                  className="relative w-[300px] flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/image2.png"
                      alt="Classic Piece 2"
                      fill
                      className="object-cover object-center"
                      sizes="300px"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          Trending
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          New
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Classic Piece 2</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">$299.99</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white rounded-full text-black"
                          onClick={() => handleAddToCart({
                            id: "classic-piece-2",
                            name: "Classic Piece 2",
                            price: 299.99,
                            image: "/image2.png"
                          })}
                        >
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Classic Piece 3 */}
                <motion.div
                  className="relative w-[300px] flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/image3.png"
                      alt="Classic Piece 3"
                      fill
                      className="object-cover object-center"
                      sizes="300px"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          Trending
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          New
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Classic Piece 3</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">$299.99</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white rounded-full text-black"
                          onClick={() => handleAddToCart({
                            id: "classic-piece-3",
                            name: "Classic Piece 3",
                            price: 299.99,
                            image: "/image3.png"
                          })}
                        >
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Classic Piece 4 */}
                <motion.div
                  className="relative w-[300px] flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/image4.png"
                      alt="Classic Piece 4"
                      fill
                      className="object-cover object-center"
                      sizes="300px"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          Trending
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          New
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Classic Piece 4</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">$299.99</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white rounded-full text-black"
                          onClick={() => handleAddToCart({
                            id: "classic-piece-4",
                            name: "Classic Piece 4",
                            price: 299.99,
                            image: "/image4.png"
                          })}
                        >
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Classic Piece 5 */}
                <motion.div
                  className="relative w-[300px] flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src="/image5.png"
                      alt="Classic Piece 5"
                      fill
                      className="object-cover object-center"
                      sizes="300px"
                      quality={100}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          Trending
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                          New
                        </span>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Classic Piece 5</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">$299.99</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-white rounded-full text-black"
                          onClick={() => handleAddToCart({
                            id: "classic-piece-5",
                            name: "Classic Piece 5",
                            price: 299.99,
                            image: "/image5.png"
                          })}
                        >
                          <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
        </motion.div>

              {/* Gradient Overlays */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
            </div>
          </div>
        </section>

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
            {translate("Explore Our Collection", language)}
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

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="font-serif text-3xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">NICO</h3>
              <p className="text-gray-400 leading-relaxed">
                {translate("Crafting timeless elegance through premium fashion pieces that define the modern wardrobe.", language)}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-medium text-xl mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {translate("Quick Links", language)}
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("New Arrivals", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Bestsellers", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Men's Collection", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Women's Collection", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Sale", language)}
                  </a>
                </li>
              </ul>
            </div>

            {/* Help & Info */}
            <div>
              <h4 className="font-medium text-xl mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {translate("Help & Info", language)}
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Customer Service", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Shipping Information", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Returns & Exchanges", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Size Guide", language)}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 inline-flex items-center group">
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -left-3"></span>
                    {translate("Privacy Policy", language)}
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-medium text-xl mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {translate("Stay Updated", language)}
              </h4>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {translate("Subscribe to our newsletter for exclusive offers and updates.", language)}
              </p>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder={translate("Enter your email", language)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <button className="w-full px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
                  {translate("Subscribe", language)}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800/50 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 NICO. {translate("All rights reserved.", language)}
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105">
                  {translate("Terms & Conditions", language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105">
                  {translate("Privacy Policy", language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105">
                  {translate("Cookie Policy", language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:scale-105">
                  {translate("Impressum", language)}
                </a>
              </div>
              <div className="flex items-center space-x-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-8 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1280px-PayPal_logo.svg.png" alt="PayPal" className="h-8 opacity-80 hover:opacity-100 transition-opacity duration-300" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/640px-Apple_Pay_logo.svg.png" alt="Apple Pay" className="h-8 opacity-80 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

