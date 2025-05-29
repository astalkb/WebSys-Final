import { Metadata } from "next"
import { AboutContent } from "@/components/about/about-content"

export const metadata: Metadata = {
  title: "About Us | ModernShop",
  description: "Learn more about our company and mission",
}

export default function AboutPage() {
  return <AboutContent />
} 