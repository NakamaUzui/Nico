"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Filter, X, Star, Check, Mail, Instagram, Facebook, Twitter } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/context/store-context"
import { useTranslation } from "@/context/translation-context"
import Image from "next/image"

// Verfügbare Größen und Farben für die Filter
const availableSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "S", "M", "L", "XL"]
const availableColors = [
  { name: "Black", color: "bg-black" },
  { name: "White", color: "bg-white border" },
  { name: "Beige", color: "bg-[#E8DCCA]" },
  { name: "Brown", color: "bg-[#964B00]" },
  { name: "Navy", color: "bg-[#000080]" },
  { name: "Gray", color: "bg-gray-400" },
]

// Beispiel-Bestseller für die Sidebar
const bestsellerProducts = [
  {
    id: 1,
    name: "OLD MONEY SUEDE LOAFERS",
    price: 199.95,
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "OLD MONEY HIGH SUEDE LOAFERS",
    price: 219.95,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop",
  },
]

// Beispiel-Kategorien
const categories = [
  { name: "Shoes", count: 24 },
  { name: "Shirts", count: 18 },
  { name: "Pants", count: 12 },
  { name: "Accessories", count: 32 },
  { name: "Outerwear", count: 8 },
]

// Beispiel-Materialien
const materials = [
  { name: "Leather", count: 15 },
  { name: "Cotton", count: 28 },
  { name: "Linen", count: 12 },
  { name: "Wool", count: 9 },
  { name: "Cashmere", count: 5 },
  { name: "Suede", count: 7 },
]

// Beispiel-Bewertungen
const ratings = [
  { value: 5, count: 42 },
  { value: 4, count: 36 },
  { value: 3, count: 18 },
  { value: 2, count: 7 },
  { value: 1, count: 3 },
]

export type FilterState = {
  priceRange: [number, number]
  inStockOnly: boolean
  selectedSizes: string[]
  selectedColors: string[]
  selectedCategories?: string[]
  selectedMaterials?: string[]
  minRating?: number
  sustainableOnly?: boolean
}

export default function FilterSidebar({
  onFilterChange = () => {},
}: {
  onFilterChange?: (filters: FilterState) => void
}) {
  const { currency } = useStore()
  const { translate } = useTranslation()
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    size: false,
    color: false,
    category: false,
    material: false,
    rating: false,
    sustainability: false,
    bestsellers: true,
    newsletter: false,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sustainableOnly, setSustainableOnly] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }[currency]

  // Berechne die Anzahl der aktiven Filter
  useEffect(() => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 500) count++
    if (inStockOnly) count++
    count += selectedSizes.length
    count += selectedColors.length
    count += selectedCategories.length
    count += selectedMaterials.length
    if (minRating !== null) count++
    if (sustainableOnly) count++
    setActiveFilters(count)

    // Notify parent component about filter changes
    onFilterChange({
      priceRange,
      inStockOnly,
      selectedSizes,
      selectedColors,
      selectedCategories,
      selectedMaterials,
      minRating: minRating || undefined,
      sustainableOnly,
    })
  }, [
    priceRange,
    inStockOnly,
    selectedSizes,
    selectedColors,
    selectedCategories,
    selectedMaterials,
    minRating,
    sustainableOnly,
    onFilterChange,
  ])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value as [number, number])
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setPriceRange([value, priceRange[1]])
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0
    setPriceRange([priceRange[0], value])
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]))
  }

  const handleRatingChange = (rating: number) => {
    setMinRating(minRating === rating ? null : rating)
  }

  const resetFilters = () => {
    setPriceRange([0, 500])
    setInStockOnly(false)
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedCategories([])
    setSelectedMaterials([])
    setMinRating(null)
    setSustainableOnly(false)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => {
        setIsSubscribed(false)
        setExpandedSections({
          ...expandedSections,
          newsletter: false,
        })
      }, 3000)
    }
  }

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">{translate("FILTERS")}</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <Filter className="h-4 w-4" />
          {translate("FILTERS")}
          {activeFilters > 0 && (
            <span className="ml-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white p-4 lg:hidden overflow-y-auto"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">{translate("FILTERS")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="in-stock-mobile" className="text-sm">
                  {translate("In stock only")}
                </Label>
                <Switch id="in-stock-mobile" checked={inStockOnly} onCheckedChange={setInStockOnly} />
              </div>

              {/* Preis-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("price")}
                >
                  <span>{translate("PRICE")}</span>
                  {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.price && (
                  <div className="mt-4 space-y-4">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceChange}
                      className="my-6"
                    />

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <span className="px-2 bg-gray-50">{currencySymbol}</span>
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={handleMinPriceChange}
                          className="w-16 border-0"
                          min={0}
                        />
                      </div>
                      <span>to</span>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <span className="px-2 bg-gray-50">{currencySymbol}</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={handleMaxPriceChange}
                          className="w-16 border-0"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Größen-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("size")}
                >
                  <span>{translate("SIZE")}</span>
                  {expandedSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.size && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        className={`border rounded-md py-1 px-2 text-sm transition-colors ${
                          selectedSizes.includes(size) ? "bg-black text-white" : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Farben-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("color")}
                >
                  <span>{translate("COLOR")}</span>
                  {expandedSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.color && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {availableColors.map((colorOption) => (
                      <button
                        key={colorOption.name}
                        className={`flex flex-col items-center gap-1 ${
                          selectedColors.includes(colorOption.name) ? "scale-110" : ""
                        }`}
                        title={colorOption.name}
                        onClick={() => toggleColor(colorOption.name)}
                      >
                        <span
                          className={`w-6 h-6 rounded-full ${colorOption.color} ${
                            selectedColors.includes(colorOption.name) ? "ring-2 ring-black ring-offset-2" : ""
                          }`}
                        ></span>
                        <span className="text-xs">{colorOption.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Kategorien-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("category")}
                >
                  <span>CATEGORY</span>
                  {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.category && (
                  <div className="mt-4 space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-black focus:ring-black"
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => toggleCategory(category.name)}
                          />
                          <span>{category.name}</span>
                        </label>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Material-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("material")}
                >
                  <span>MATERIAL</span>
                  {expandedSections.material ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.material && (
                  <div className="mt-4 space-y-2">
                    {materials.map((material) => (
                      <div key={material.name} className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-black focus:ring-black"
                            checked={selectedMaterials.includes(material.name)}
                            onChange={() => toggleMaterial(material.name)}
                          />
                          <span>{material.name}</span>
                        </label>
                        <span className="text-xs text-gray-500">({material.count})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bewertungs-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("rating")}
                >
                  <span>RATING</span>
                  {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.rating && (
                  <div className="mt-4 space-y-2">
                    {ratings.map((rating) => (
                      <button
                        key={rating.value}
                        className={`flex items-center justify-between w-full py-1 px-2 rounded-md text-sm ${
                          minRating === rating.value ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleRatingChange(rating.value)}
                      >
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating.value ? "fill-current text-black" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="ml-2">{rating.value === 1 ? "& up" : `& up`}</span>
                        </div>
                        <span className="text-xs text-gray-500">({rating.count})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nachhaltigkeit-Filter */}
              <div className="border-t pt-4">
                <button
                  className="flex items-center justify-between w-full text-left font-medium"
                  onClick={() => toggleSection("sustainability")}
                >
                  <span>SUSTAINABILITY</span>
                  {expandedSections.sustainability ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.sustainability && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="sustainable-only" className="text-sm">
                        Sustainable products only
                      </Label>
                      <Switch id="sustainable-only" checked={sustainableOnly} onCheckedChange={setSustainableOnly} />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Products that meet our sustainability criteria, including eco-friendly materials and ethical
                      production.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <Button className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                {translate("Apply Filters")} {activeFilters > 0 && `(${activeFilters})`}
              </Button>
              <Button variant="outline" className="flex-1" onClick={resetFilters} disabled={activeFilters === 0}>
                {translate("Reset")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop filters */}
      <div className="hidden lg:block space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{translate("FILTERS")}</h2>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
              {translate("Reset all")}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="in-stock" className="text-sm">
            {translate("In stock only")}
          </Label>
          <Switch id="in-stock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
        </div>

        {/* Preis-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("price")}
          >
            <span>{translate("PRICE")}</span>
            {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.price && (
              <motion.div
                className="mt-4 space-y-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />

                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="px-2 bg-gray-50">{currencySymbol}</span>
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={handleMinPriceChange}
                      className="w-16 border-0"
                      min={0}
                    />
                  </div>
                  <span>to</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="px-2 bg-gray-50">{currencySymbol}</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={handleMaxPriceChange}
                      className="w-16 border-0"
                      min={0}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Größen-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("size")}
          >
            <span>{translate("SIZE")}</span>
            {expandedSections.size ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.size && (
              <motion.div
                className="mt-4 grid grid-cols-3 gap-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {availableSizes.map((size) => (
                  <motion.button
                    key={size}
                    className={`border rounded-md py-1 px-2 text-sm transition-colors ${
                      selectedSizes.includes(size) ? "bg-black text-white" : "hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Farben-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("color")}
          >
            <span>{translate("COLOR")}</span>
            {expandedSections.color ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.color && (
              <motion.div
                className="mt-4 flex flex-wrap gap-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {availableColors.map((colorOption) => (
                  <motion.button
                    key={colorOption.name}
                    className={`flex flex-col items-center gap-1 ${
                      selectedColors.includes(colorOption.name) ? "scale-110" : ""
                    }`}
                    title={colorOption.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleColor(colorOption.name)}
                  >
                    <span
                      className={`w-6 h-6 rounded-full ${colorOption.color} ${
                        selectedColors.includes(colorOption.name) ? "ring-2 ring-black ring-offset-2" : ""
                      }`}
                    ></span>
                    <span className="text-xs">{colorOption.name}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Kategorien-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("category")}
          >
            <span>CATEGORY</span>
            {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.category && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-black focus:ring-black"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                      />
                      <span>{category.name}</span>
                    </label>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Material-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("material")}
          >
            <span>MATERIAL</span>
            {expandedSections.material ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.material && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {materials.map((material) => (
                  <div key={material.name} className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-black focus:ring-black"
                        checked={selectedMaterials.includes(material.name)}
                        onChange={() => toggleMaterial(material.name)}
                      />
                      <span>{material.name}</span>
                    </label>
                    <span className="text-xs text-gray-500">({material.count})</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bewertungs-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("rating")}
          >
            <span>RATING</span>
            {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.rating && (
              <motion.div
                className="mt-4 space-y-2"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {ratings.map((rating) => (
                  <motion.button
                    key={rating.value}
                    className={`flex items-center justify-between w-full py-1 px-2 rounded-md text-sm ${
                      minRating === rating.value ? "bg-gray-100" : ""
                    }`}
                    whileHover={{ backgroundColor: "#f9f9f9" }}
                    onClick={() => handleRatingChange(rating.value)}
                  >
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating.value ? "fill-current text-black" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2">{rating.value === 1 ? "& up" : `& up`}</span>
                    </div>
                    <span className="text-xs text-gray-500">({rating.count})</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nachhaltigkeit-Filter */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("sustainability")}
          >
            <span>SUSTAINABILITY</span>
            {expandedSections.sustainability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.sustainability && (
              <motion.div
                className="mt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sustainable-only" className="text-sm">
                    Sustainable products only
                  </Label>
                  <Switch id="sustainable-only" checked={sustainableOnly} onCheckedChange={setSustainableOnly} />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Products that meet our sustainability criteria, including eco-friendly materials and ethical
                  production.
                </p>
                <div className="mt-3 p-2 bg-[#f8f9f4] rounded-md border border-[#e0e3d7]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2D5D56]" />
                    <span className="text-xs">Eco-friendly materials</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Check className="h-4 w-4 text-[#2D5D56]" />
                    <span className="text-xs">Ethical production</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Check className="h-4 w-4 text-[#2D5D56]" />
                    <span className="text-xs">Reduced carbon footprint</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bestseller-Produkte */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("bestsellers")}
          >
            <span>BESTSELLERS</span>
            {expandedSections.bestsellers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.bestsellers && (
              <motion.div
                className="mt-4 space-y-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {bestsellerProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex items-center gap-3 group cursor-pointer"
                    whileHover={{ x: 3 }}
                  >
                    <div className="relative h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium line-clamp-2 group-hover:text-[#2D5D56] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs mt-1">
                        {currencySymbol}
                        {product.price.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  className="text-xs text-[#2D5D56] font-medium hover:underline w-full text-center mt-2"
                  whileHover={{ scale: 1.03 }}
                >
                  View all bestsellers
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Newsletter-Anmeldung */}
        <div className="border-t pt-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection("newsletter")}
          >
            <span>NEWSLETTER</span>
            {expandedSections.newsletter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {expandedSections.newsletter && (
              <motion.div
                className="mt-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-gray-600 mb-3">
                  Subscribe to our newsletter and get 10% off your first order.
                </p>
                {isSubscribed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-[#f8f9f4] rounded-md border border-[#e0e3d7] text-center"
                  >
                    <Check className="h-5 w-5 text-[#2D5D56] mx-auto mb-1" />
                    <p className="text-sm font-medium text-[#2D5D56]">Thank you for subscribing!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Your email address"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-black hover:bg-gray-800">
                      Subscribe
                    </Button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social Media */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">FOLLOW US</h3>
          <div className="flex items-center gap-3">
            <motion.a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </>
  )
}

