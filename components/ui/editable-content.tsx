"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updatePageContent } from "@/lib/actions/page-content"
import { toast } from "sonner"

interface EditableContentProps {
  page: string
  content: string
  isAdmin?: boolean
}

export function EditableContent({ page, content, isAdmin = false }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleSave = async () => {
    const result = await updatePageContent(page, editedContent)
    if (result.success) {
      toast.success("Content updated successfully")
      setIsEditing(false)
    } else {
      toast.error("Failed to update content")
    }
  }

  if (!isAdmin) {
    return <div className="prose max-w-none">{content}</div>
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[200px]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="prose max-w-none">{content}</div>
          <Button onClick={() => setIsEditing(true)}>Edit Content</Button>
        </>
      )}
    </div>
  )
} 