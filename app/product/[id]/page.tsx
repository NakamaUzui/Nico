"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { translate } from "@/utils/translate"

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart, currency } = useStore()
  const { language } = useLanguage()
  const { toast } = useToast()
  
  // Beispiel-Produktdaten (später durch echte Daten ersetzen)
  const product = {
    id: Number(params.id),
    name: "Classic Trench Coat",
    price: 299.99,
    description: translate("Classic Trench Description", language),
    colors: [
      { 
        name: translate("Black", language), 
        images: [
          "/image.png",
          "/image2.png",
          "/image3.png"
        ]
      },
      { 
        name: translate("Navy", language), 
        images: [
          "/image2.png",
          "/image3.png",
          "/image4.png"
        ]
      },
      { 
        name: translate("Light Gray", language), 
        images: [
          "/image3.png",
          "/image4.png",
          "/image5.png"
        ]
      },
      { 
        name: translate("Blue", language), 
        images: [
          "/image4.png",
          "/image5.png",
          "/image.png"
        ]
      },
      { 
        name: translate("Beige", language), 
        images: [
          "/image5.png",
          "/image.png",
          "/image2.png"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: [translate("Cotton", language)],
    care: translate("Professional dry clean only", language),
    details: [
      translate("Removable lining", language),
      translate("Storm flap", language),
      translate("Adjustable belt", language),
      translate("Water-resistant", language),
      translate("Double-breasted design", language)
    ]
  }

  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].name)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }[currency]

  // Hilfsfunktion um die Bilder der aktuell ausgewählten Farbe zu bekommen
  const getCurrentColorImages = () => {
    const color = product.colors.find(c => c.name === selectedColor)
    return color ? color.images : []
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: translate("Missing Information", language),
        description: translate("Please select both size and color before adding to cart.", language),
        variant: "destructive",
      })
      return
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
    })

    toast({
      title: translate("Added to Cart!", language),
      description: `${product.name} ${translate("has been added to your cart.", language)}`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Produktbilder */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100">
            <Image
              src={getCurrentColorImages()[selectedImageIndex]}
              alt={`${product.name} in ${selectedColor}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {getCurrentColorImages().map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                  selectedImageIndex === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} in ${selectedColor} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Produktinformationen */}
        <div className="space-y-6">
          <h1 className="text-3xl font-serif">{product.name}</h1>
          <p className="text-2xl font-medium">{currencySymbol}{product.price}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{translate("Select Color", language)}: {selectedColor}</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name)
                      setSelectedImageIndex(0) // Reset image index when changing color
                    }}
                    className={`relative w-20 h-20 border rounded-md overflow-hidden ${
                      selectedColor === color.name
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-primary/50"
                    }`}
                  >
                    <Image
                      src={color.images[0]}
                      alt={`${product.name} in ${color.name}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">{translate("Select Size", language)}</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddToCart}
            className="w-full"
            size="lg"
          >
            {translate("Add to Cart", language)}
          </Button>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{translate("Description", language)}</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">{translate("Details", language)}</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">{translate("Care Instructions", language)}</h3>
              <p className="text-muted-foreground">{product.care}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 