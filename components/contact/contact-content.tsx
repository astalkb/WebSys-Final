"use client"

import { ContactForm } from "@/components/contact/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getPageContent, updatePageContent } from "@/lib/actions/page-content"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ContactContent() {
  const { data: session } = useSession()
  console.log("SESSION DEBUG:", session);
  const [addressContent, setAddressContent] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [phoneContent, setPhoneContent] = useState("")
  const [hoursContent, setHoursContent] = useState("")
  

  // Dialog states
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false)
  const [editedAddress, setEditedAddress] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [editedPhone, setEditedPhone] = useState("")
  const [editedHours, setEditedHours] = useState("")

  useEffect(() => {
    const fetchContent = async () => {
      const address = await getPageContent("contact-address")
      const email = await getPageContent("contact-email")
      const phone = await getPageContent("contact-phone")
      const hours = await getPageContent("contact-hours")

      setAddressContent(address || "123 E-Commerce Street, Digital City, 12345")
      setEmailContent(email || "contact@example.com")
      setPhoneContent(phone || "+1 (555) 123-4567")
      setHoursContent(hours || "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed")
    }

    fetchContent()
  }, [])

  const handleAddressSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    const result = await updatePageContent("contact-address", editedAddress)
    if (result.success) {
      setAddressContent(editedAddress)
      setAddressDialogOpen(false)
    } else {
      toast.error(result.error || "Failed to update address")
    }
  }

  const handleEmailSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    const result = await updatePageContent("contact-email", editedEmail)
    if (result.success) {
      setEmailContent(editedEmail)
      setEmailDialogOpen(false)
    } else {
      toast.error(result.error || "Failed to update email")
    }
  }

  const handlePhoneSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    const result = await updatePageContent("contact-phone", editedPhone)
    if (result.success) {
      setPhoneContent(editedPhone)
      setPhoneDialogOpen(false)
    } else {
      toast.error(result.error || "Failed to update phone")
    }
  }

  const handleHoursSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    const result = await updatePageContent("contact-hours", editedHours)
    if (result.success) {
      setHoursContent(editedHours)
      setHoursDialogOpen(false)
    } else {
      toast.error(result.error || "Failed to update hours")
    }
  }

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Visit our office</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{addressContent}</p>
              {isAdmin && (
                <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedAddress(addressContent)}
                    >
                      Edit Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Address</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Office Address</Label>
                        <Textarea
                          id="address"
                          value={editedAddress}
                          onChange={(e) => setEditedAddress(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleAddressSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>Send us a message</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{emailContent}</p>
              {isAdmin && (
                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedEmail(emailContent)}
                    >
                      Edit Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Contact Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleEmailSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phone</CardTitle>
              <CardDescription>Call us directly</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{phoneContent}</p>
              {isAdmin && (
                <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedPhone(phoneContent)}
                    >
                      Edit Phone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Phone Number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editedPhone}
                          onChange={(e) => setEditedPhone(e.target.value)}
                        />
                      </div>
                      <Button onClick={handlePhoneSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When we're available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{hoursContent}</p>
              {isAdmin && (
                <Dialog open={hoursDialogOpen} onOpenChange={setHoursDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedHours(hoursContent)}
                    >
                      Edit Hours
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Business Hours</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Business Hours</Label>
                        <Textarea
                          id="hours"
                          value={editedHours}
                          onChange={(e) => setEditedHours(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleHoursSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 