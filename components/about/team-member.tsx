"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { updatePageContent, getPageContent } from "@/lib/actions/page-content"
import { Upload } from "lucide-react"

interface TeamMemberProps {
  id: string
  name: string
  role: string
  image: string
  description: string
  isAdmin?: boolean
  onUpdate?: () => void
}

export function TeamMember({ id, name, role, image, description, isAdmin, onUpdate }: TeamMemberProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const [editedRole, setEditedRole] = useState(role)
  const [editedDescription, setEditedDescription] = useState(description)
  const [editedImage, setEditedImage] = useState(image)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch the latest content when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchContent = async () => {
        try {
          const [nameContent, roleContent, descriptionContent, imageContent] = await Promise.all([
            getPageContent(`team-${id}-name`),
            getPageContent(`team-${id}-role`),
            getPageContent(`team-${id}-description`),
            getPageContent(`team-${id}-image`)
          ])

          // Only update if we have content from the database
          if (nameContent) setEditedName(nameContent)
          if (roleContent) setEditedRole(roleContent)
          if (descriptionContent) setEditedDescription(descriptionContent)
          if (imageContent) setEditedImage(imageContent)
        } catch (error) {
          console.error('Error fetching team member content:', error)
        }
      }

      fetchContent()
    }
  }, [isOpen, id])

  const handleSave = async () => {
    try {
      // Save all content in parallel
      const results = await Promise.all([
        updatePageContent(`team-${id}-name`, editedName),
        updatePageContent(`team-${id}-role`, editedRole),
        updatePageContent(`team-${id}-description`, editedDescription),
        updatePageContent(`team-${id}-image`, editedImage)
      ])

      // Check if all updates were successful
      const allSuccessful = results.every(result => result.success)
      if (!allSuccessful) {
        throw new Error('Some updates failed')
      }

      // Close dialog and trigger parent update
      setIsOpen(false)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('id', id)

      const response = await fetch('/api/upload/team', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Update the image URL in state
      setEditedImage(data.url)
      
      // Save the new image URL to the database immediately
      const result = await updatePageContent(`team-${id}-image`, data.url)
      if (!result.success) {
        throw new Error('Failed to save image URL')
      }
      
      // Trigger parent update to refresh the display
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={editedImage}
          alt={editedName}
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{editedName}</CardTitle>
        <p className="text-muted-foreground">{editedRole}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{editedDescription}</p>
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">Edit Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20">
                      <Image
                        src={editedImage}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                        priority
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      {isUploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
} 