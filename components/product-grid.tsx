"use client"

import React from "react"

import Image from "next/image"
import { Star, ShoppingBag, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { useStore } from "@/context/store-context"
import type { FilterState } from "@/components/filter-sidebar"
import { useInView } from "framer-motion"

export const products = [
  {
    id: 1,
    name: "OLD MONEY SUEDE LOAFERS",
    price: 199.95,
    originalPrice: 254.95,
    rating: 4.9,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop",
    colors: ["Beige"],
    sizes: ["40", "41", "42", "43", "44"],
    inStock: true,
    saveAmount: 55.0,
  },
  {
    id: 2,
    name: "CAPE TOWN - 100% LINEN SHIRT",
    price: 129.95,
    originalPrice: 149.95,
    rating: 4.9,
    reviewCount: 18,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
    colors: ["Beige", "White"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    saveAmount: 20.0,
  },
  {
    id: 3,
    name: "OLD MONEY HIGH SUEDE LOAFERS",
    price: 219.95,
    originalPrice: 287.95,
    rating: 4.8,
    reviewCount: 33,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
    colors: ["Black", "Brown"],
    sizes: ["40", "41", "42", "43"],
    inStock: true,
    saveAmount: 68.0,
  },
  {
    id: 4,
    name: "PREMIUM COTTON POLO SHIRT",
    price: 89.95,
    originalPrice: 119.95,
    rating: 4.7,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=1000&auto=format&fit=crop",
    colors: ["Navy", "White", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    saveAmount: 30.0,
  },
  {
    id: 5,
    name: "ITALIAN LEATHER BELT",
    price: 79.95,
    originalPrice: 99.95,
    rating: 4.8,
    reviewCount: 27,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop",
    colors: ["Brown", "Black"],
    sizes: ["S", "M", "L"],
    inStock: false,
    saveAmount: 20.0,
  },
  {
    id: 6,
    name: "CASHMERE BLEND SWEATER",
    price: 149.95,
    originalPrice: 199.95,
    rating: 4.9,
    reviewCount: 19,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1000&auto=format&fit=crop",
    colors: ["Gray", "Navy", "Beige"],
    sizes: ["S", "M", "L"],
    inStock: true,
    saveAmount: 50.0,
  },
]

// Komponente für Scroll-basierte Animation
function ProductCard({ product, index, handleAddToCart, addedToCart, currencySymbol }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm">
        <motion.div
          className="absolute top-2 right-2 z-10 bg-[#2D5D56] text-white text-xs font-medium px-2 py-1"
          initial={{ x: 50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
        >
          SAVE {currencySymbol}
          {product.saveAmount.toFixed(2)}
        </motion.div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-white px-3 py-1 text-sm font-medium">Ausverkauft</span>
          </div>
        )}

        <motion.div
          className="absolute top-2 left-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          <motion.button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isFavorite ? "bg-red-500 text-white" : "bg-white text-black"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
        </motion.div>

        <motion.div
          style={{
            scale: isHovered ? 1.1 : 1,
            transition: "transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover object-center"
          />
        </motion.div>

        {/* Add to cart button in the center - KORRIGIERT: Kein grauer Hintergrund mehr */}
        {product.inStock && (
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <ShoppingBag className="h-5 w-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Added to cart animation */}
        <AnimatePresence>
          {addedToCart === product.id && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white text-black rounded-md px-4 py-2 font-medium"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                Added to Cart!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-4 flex items-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current text-black" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
      </motion.div>

      <motion.h3
        className="mt-1 text-sm font-medium"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
      >
        {product.name}
      </motion.h3>

      <motion.div
        className="mt-1 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
      >
        <span className="text-sm font-medium">
          {currencySymbol}
          {product.price.toFixed(2)}
        </span>
        <span className="ml-2 text-sm text-gray-500 line-through">
          {currencySymbol}
          {product.originalPrice.toFixed(2)}
        </span>
      </motion.div>

      <motion.div
        className="mt-2 flex flex-wrap gap-1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
      >
        {product.colors.map((color, i) => (
          <React.Fragment key={color}>
            {i > 0 && <span className="text-xs text-gray-500">/</span>}
            <span className="text-xs text-gray-500">{color}</span>
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  )
}

interface ProductGridProps {
  filters?: FilterState
  sortOption?: string
}

export default function ProductGrid({ filters, sortOption = "FEATURED" }: ProductGridProps) {
  const { addToCart, currency } = useStore()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [addedToCart, setAddedToCart] = useState<number | null>(null)
  const [isFiltering, setIsFiltering] = useState(false)

  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }[currency]

  // Filtern und Sortieren der Produkte basierend auf den Filtern und der Sortierungsoption
  useEffect(() => {
    setIsFiltering(true)

    // Verzögerung für Animation
    const timer = setTimeout(() => {
      let result = [...products]

      // Filtern
      if (filters) {
        // Preis-Filter
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
          result = result.filter(
            (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
          )
        }

        // Nur auf Lager
        if (filters.inStockOnly) {
          result = result.filter((product) => product.inStock)
        }

        // Größen-Filter
        if (filters.selectedSizes.length > 0) {
          result = result.filter((product) => product.sizes.some((size) => filters.selectedSizes.includes(size)))
        }

        // Farben-Filter
        if (filters.selectedColors.length > 0) {
          result = result.filter((product) => product.colors.some((color) => filters.selectedColors.includes(color)))
        }
      }

      // Sortieren
      switch (sortOption) {
        case "PRICE: LOW TO HIGH":
          result.sort((a, b) => a.price - b.price)
          break
        case "PRICE: HIGH TO LOW":
          result.sort((a, b) => b.price - a.price)
          break
        case "NEWEST":
          result.sort((a, b) => b.id - a.id)
          break
        case "BEST SELLING":
          result.sort((a, b) => b.reviewCount - a.reviewCount)
          break
      }

      setFilteredProducts(result)
      setIsFiltering(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, sortOption])

  const handleAddToCart = (product: any) => {
    addToCart(product)
    setAddedToCart(product.id)

    setTimeout(() => {
      setAddedToCart(null)
    }, 1500)
  }

  return (
    <AnimatePresence mode="wait">
      {isFiltering ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="col-span-full py-12 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
            className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-500">Filtering products...</p>
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredProducts.length === 0 ? (
            <motion.div
              className="col-span-full py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-lg text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Keine Produkte gefunden, die Ihren Filterkriterien entsprechen.
              </motion.p>
              <motion.p
                className="mt-2 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Versuchen Sie, Ihre Filter anzupassen oder zurückzusetzen.
              </motion.p>
            </motion.div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                handleAddToCart={handleAddToCart}
                addedToCart={addedToCart}
                currencySymbol={currencySymbol}
              />
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

