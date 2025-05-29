import { Metadata } from "next"
import { ContactContent } from "@/components/contact/contact-content"

export const metadata: Metadata = {
  title: "Contact Us | ModernShop",
  description: "Get in touch with our team",
}

export default function ContactPage() {
  return <ContactContent />
}