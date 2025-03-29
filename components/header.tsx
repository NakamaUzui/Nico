"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, Search as SearchIcon, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Cart from "@/components/cart"
import Search from "@/components/search"
import { useStore } from "@/context/store-context"
import { useLanguage } from "@/context/language-context"
import { translate } from "@/utils/translate"

// Menü-Daten für die Dropdown-Menüs
const menuData = {
  men: [
    { name: "Shoes", href: "#", featured: true },
    { name: "Shirts", href: "#" },
    { name: "Pants", href: "#" },
    { name: "Accessories", href: "#" },
    { name: "Suits", href: "#" },
    { name: "Outerwear", href: "#" },
  ],
  women: [
    { name: "Shoes", href: "#" },
    { name: "Dresses", href: "#", featured: true },
    { name: "Tops", href: "#" },
    { name: "Accessories", href: "#" },
    { name: "Skirts", href: "#" },
    { name: "Outerwear", href: "#", featured: true },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Shipping", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Size Guide", href: "#" },
  ],
}

export default function Header() {
  const { cart, setCartOpen, currency, setCurrency, setSearchOpen } = useStore()
  const { language, setLanguage } = useLanguage()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)

  const currencyMenuRef = useRef<HTMLDivElement>(null)

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)

    // Handle clicks outside of menus
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  const handleCurrencyChange = (newCurrency: "USD" | "EUR" | "GBP") => {
    setCurrency(newCurrency)
    setCurrencyMenuOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white py-4 transition-all duration-300 ${scrolled ? "shadow-md py-2" : "border-b border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div
                className="relative"
                onMouseEnter={() => setActiveMenu("men")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center space-x-1 text-sm font-medium py-2">
                  <span>{translate("SHOP MEN", language)}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeMenu === "men" ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "men" && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4">
                        <div className="grid gap-2">
                          {menuData.men.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`text-sm hover:text-gray-600 transition-colors ${item.featured ? "font-medium" : ""}`}
                            >
                              {translate(item.name, language)}
                              {item.featured && (
                                <span className="ml-2 text-xs text-oldmoney-green">{translate("Featured", language)}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setActiveMenu("women")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center space-x-1 text-sm font-medium py-2">
                  <span>{translate("SHOP WOMEN", language)}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeMenu === "women" ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "women" && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4">
                        <div className="grid gap-2">
                          {menuData.women.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`text-sm hover:text-gray-600 transition-colors ${item.featured ? "font-medium" : ""}`}
                            >
                              {translate(item.name, language)}
                              {item.featured && (
                                <span className="ml-2 text-xs text-oldmoney-green">{translate("Featured", language)}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="relative"
                onMouseEnter={() => setActiveMenu("support")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className="flex items-center space-x-1 text-sm font-medium py-2">
                  <span>{translate("SUPPORT", language)}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeMenu === "support" ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "support" && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md overflow-hidden z-10"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4">
                        <div className="grid gap-2">
                          {menuData.support.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="text-sm hover:text-gray-600 transition-colors"
                            >
                              {translate(item.name, language)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center">
                <h1 className="font-serif text-2xl md:text-3xl tracking-widest text-gray-900">NICO</h1>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm ${language === 'de' ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setLanguage('de');
                    setCurrency('EUR');
                  }}
                >
                  DE
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-sm ${language === 'en' ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setLanguage('en');
                    setCurrency('USD');
                  }}
                >
                  EN
                </Button>
              </div>

              {/* Currency Selector */}
              <div className="relative" ref={currencyMenuRef}>
                <button
                  className="flex items-center space-x-1 text-sm"
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  aria-label={translate("Select Currency", language)}
                >
                  <span>
                    {currency === "USD" && "🇺🇸"}
                    {currency === "EUR" && "🇪🇺"}
                    {currency === "GBP" && "🇬🇧"}
                  </span>
                  <span className="hidden sm:inline">
                    {translate(currency, language)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${currencyMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {currencyMenuOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-32 bg-white shadow-lg rounded-md p-2 z-10"
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => handleCurrencyChange("USD")}
                        className="flex items-center space-x-2 p-1 w-full text-left text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>🇺🇸</span>
                        <span>{translate("USD", language)}</span>
                      </button>
                      <button
                        onClick={() => handleCurrencyChange("EUR")}
                        className="flex items-center space-x-2 p-1 w-full text-left text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>🇪🇺</span>
                        <span>{translate("EUR", language)}</span>
                      </button>
                      <button
                        onClick={() => handleCurrencyChange("GBP")}
                        className="flex items-center space-x-2 p-1 w-full text-left text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        <span>🇬🇧</span>
                        <span>{translate("GBP", language)}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="p-1" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <SearchIcon className="h-5 w-5" />
              </button>

              <button className="p-1 relative" aria-label="Cart" onClick={() => setCartOpen(true)}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-white z-40 pt-20 px-4 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute top-4 right-4">
                <button onClick={toggleMenu} className="p-2 focus:outline-none" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6 py-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">{translate("SHOP MEN", language)}</h3>
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {menuData.men.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm py-2 flex items-center"
                        onClick={toggleMenu}
                      >
                        {translate(item.name, language)}
                        {item.featured && (
                          <span className="ml-2 text-xs text-oldmoney-green">{translate("Featured", language)}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">{translate("SHOP WOMEN", language)}</h3>
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {menuData.women.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm py-2 flex items-center"
                        onClick={toggleMenu}
                      >
                        {translate(item.name, language)}
                        {item.featured && (
                          <span className="ml-2 text-xs text-oldmoney-green">{translate("Featured", language)}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider">{translate("SUPPORT", language)}</h3>
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {menuData.support.map((item) => (
                      <Link key={item.name} href={item.href} className="text-sm py-2" onClick={toggleMenu}>
                        {translate(item.name, language)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">{translate("Language", language)}</span>
                    <select
                      className="bg-transparent border-none text-sm font-medium focus:ring-0"
                      value={language}
                      onChange={(e) => {
                        const newLanguage = e.target.value === 'Deutsch' ? 'de' : 'en';
                        setLanguage(newLanguage);
                        setCurrency(newLanguage === 'de' ? 'EUR' : 'USD');
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Deutsch">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">{translate("Currency", language)}</span>
                    <select
                      className="bg-transparent border-none text-sm font-medium focus:ring-0"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                    >
                      <option value="USD">{translate("USD", language)}</option>
                      <option value="EUR">{translate("EUR", language)}</option>
                      <option value="GBP">{translate("GBP", language)}</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Component */}
      <Cart />

      {/* Search Component */}
      <Search />
    </>
  )
}

