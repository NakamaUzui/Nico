"use client"

import { useStore } from "@/context/store-context"
import { X, SearchIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Beispiel-Produkte für die Suche
const searchProducts = [
  {
    id: 1,
    name: "OLD MONEY SUEDE LOAFERS",
    price: 199.95,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "CAPE TOWN - 100% LINEN SHIRT",
    price: 129.95,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "OLD MONEY HIGH SUEDE LOAFERS",
    price: 219.95,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "PREMIUM COTTON POLO SHIRT",
    price: 89.95,
    image: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "ITALIAN LEATHER BELT",
    price: 79.95,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "CASHMERE BLEND SWEATER",
    price: 149.95,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1000&auto=format&fit=crop",
  },
]

export default function Search() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery, currency } = useStore()
  const [results, setResults] = useState<typeof searchProducts>([])

  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }[currency]

  // Simulate search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([])
      return
    }

    const filtered = searchProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setResults(filtered)
  }, [searchQuery])

  // Close search when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setSearchOpen])

  // Prevent scrolling when search is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [searchOpen])

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          />

          <motion.div
            className="fixed inset-x-0 top-0 bg-white z-50 shadow-md"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center">
                <SearchIcon className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 border-none focus:ring-0 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {searchQuery.trim() !== "" && (
                <div className="mt-4 max-h-[70vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {results.map((product) => (
                        <Link
                          href="#"
                          key={product.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="relative h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {currencySymbol}
                              {product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

