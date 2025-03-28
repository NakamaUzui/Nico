"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useStore } from "@/context/store-context"

// Übersetzungen
const translations = {
  English: {
    // Header
    "SHOP MEN": "SHOP MEN",
    "SHOP WOMEN": "SHOP WOMEN",
    SUPPORT: "SUPPORT",
    Featured: "Featured",
    "Contact Us": "Contact Us",
    FAQ: "FAQ",
    Shipping: "Shipping",
    Returns: "Returns",
    "Size Guide": "Size Guide",
    // Filter
    FILTERS: "FILTERS",
    "Reset all": "Reset all",
    "In stock only": "In stock only",
    PRICE: "PRICE",
    SIZE: "SIZE",
    COLOR: "COLOR",
    "Apply Filters": "Apply Filters",
    Reset: "Reset",
    // Product Grid
    "Sort by:": "Sort by:",
    FEATURED: "FEATURED",
    "PRICE: LOW TO HIGH": "PRICE: LOW TO HIGH",
    "PRICE: HIGH TO LOW": "PRICE: HIGH TO LOW",
    NEWEST: "NEWEST",
    "BEST SELLING": "BEST SELLING",
    SAVE: "SAVE",
    "Added to Cart!": "Added to Cart!",
    Ausverkauft: "Sold Out",
    "Keine Produkte gefunden, die Ihren Filterkriterien entsprechen.":
      "No products found matching your filter criteria.",
    "Versuchen Sie, Ihre Filter anzupassen oder zurückzusetzen.": "Try adjusting or resetting your filters.",
    // Announcement
    "CLEARANCE SALE - UP TO 50% OFF": "CLEARANCE SALE - UP TO 50% OFF",
    "FREE SHIPPING ON ORDERS OVER $150": "FREE SHIPPING ON ORDERS OVER $150",
    "NEW ARRIVALS - SPRING COLLECTION": "NEW ARRIVALS - SPRING COLLECTION",
    // Hero
    BESTSELLERS: "BESTSELLERS",
    "Discover our curated collection of timeless luxury pieces that define the old money aesthetic.":
      "Discover our curated collection of timeless luxury pieces that define the old money aesthetic.",
    "Explore Our Collection": "Explore Our Collection",
  },
  Français: {
    // Header
    "SHOP MEN": "HOMMES",
    "SHOP WOMEN": "FEMMES",
    SUPPORT: "ASSISTANCE",
    Featured: "En vedette",
    "Contact Us": "Contactez-nous",
    FAQ: "FAQ",
    Shipping: "Expédition",
    Returns: "Retours",
    "Size Guide": "Guide des tailles",
    // Filter
    FILTERS: "FILTRES",
    "Reset all": "Réinitialiser tout",
    "In stock only": "En stock seulement",
    PRICE: "PRIX",
    SIZE: "TAILLE",
    COLOR: "COULEUR",
    "Apply Filters": "Appliquer les filtres",
    Reset: "Réinitialiser",
    // Product Grid
    "Sort by:": "Trier par:",
    FEATURED: "EN VEDETTE",
    "PRICE: LOW TO HIGH": "PRIX: CROISSANT",
    "PRICE: HIGH TO LOW": "PRIX: DÉCROISSANT",
    NEWEST: "PLUS RÉCENT",
    "BEST SELLING": "MEILLEURES VENTES",
    SAVE: "ÉCONOMISEZ",
    "Added to Cart!": "Ajouté au panier!",
    Ausverkauft: "Épuisé",
    "Keine Produkte gefunden, die Ihren Filterkriterien entsprechen.":
      "Aucun produit ne correspond à vos critères de filtrage.",
    "Versuchen Sie, Ihre Filter anzupassen oder zurückzusetzen.": "Essayez d'ajuster ou de réinitialiser vos filtres.",
    // Announcement
    "CLEARANCE SALE - UP TO 50% OFF": "SOLDES - JUSQU'À 50% DE RÉDUCTION",
    "FREE SHIPPING ON ORDERS OVER $150": "LIVRAISON GRATUITE POUR LES COMMANDES DE PLUS DE 150€",
    "NEW ARRIVALS - SPRING COLLECTION": "NOUVEAUTÉS - COLLECTION PRINTEMPS",
    // Hero
    BESTSELLERS: "MEILLEURES VENTES",
    "Discover our curated collection of timeless luxury pieces that define the old money aesthetic.":
      "Découvrez notre collection de pièces de luxe intemporelles qui définissent l'esthétique old money.",
    "Explore Our Collection": "Explorez Notre Collection",
  },
  Deutsch: {
    // Header
    "SHOP MEN": "HERREN",
    "SHOP WOMEN": "DAMEN",
    SUPPORT: "KUNDENDIENST",
    Featured: "Empfohlen",
    "Contact Us": "Kontakt",
    FAQ: "FAQ",
    Shipping: "Versand",
    Returns: "Rücksendungen",
    "Size Guide": "Größentabelle",
    // Filter
    FILTERS: "FILTER",
    "Reset all": "Alle zurücksetzen",
    "In stock only": "Nur verfügbare Artikel",
    PRICE: "PREIS",
    SIZE: "GRÖSSE",
    COLOR: "FARBE",
    "Apply Filters": "Filter anwenden",
    Reset: "Zurücksetzen",
    // Product Grid
    "Sort by:": "Sortieren nach:",
    FEATURED: "EMPFOHLEN",
    "PRICE: LOW TO HIGH": "PREIS: AUFSTEIGEND",
    "PRICE: HIGH TO LOW": "PREIS: ABSTEIGEND",
    NEWEST: "NEUESTE",
    "BEST SELLING": "BESTSELLER",
    SAVE: "SPAREN",
    "Added to Cart!": "Zum Warenkorb hinzugefügt!",
    Ausverkauft: "Ausverkauft",
    "Keine Produkte gefunden, die Ihren Filterkriterien entsprechen.":
      "Keine Produkte gefunden, die Ihren Filterkriterien entsprechen.",
    "Versuchen Sie, Ihre Filter anzupassen oder zurückzusetzen.":
      "Versuchen Sie, Ihre Filter anzupassen oder zurückzusetzen.",
    // Announcement
    "CLEARANCE SALE - UP TO 50% OFF": "AUSVERKAUF - BIS ZU 50% RABATT",
    "FREE SHIPPING ON ORDERS OVER $150": "KOSTENLOSER VERSAND BEI BESTELLUNGEN ÜBER 150€",
    "NEW ARRIVALS - SPRING COLLECTION": "NEUHEITEN - FRÜHJAHRSKOLLEKTION",
    // Hero
    BESTSELLERS: "BESTSELLER",
    "Discover our curated collection of timeless luxury pieces that define the old money aesthetic.":
      "Entdecken Sie unsere kuratierte Kollektion zeitloser Luxusstücke, die den Old-Money-Stil definieren.",
    "Explore Our Collection": "Entdecken Sie Unsere Kollektion",
  },
}

type TranslationContextType = {
  translate: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useStore()

  const translate = (key: string): string => {
    const currentTranslations = translations[language] || translations.English
    return currentTranslations[key] || key
  }

  return <TranslationContext.Provider value={{ translate }}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

