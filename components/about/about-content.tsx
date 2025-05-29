"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamMember } from "@/components/about/team-member"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getPageContent, updatePageContent } from "@/lib/actions/page-content"
import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"

const INITIAL_TEAM_MEMBERS = [
  {
    id: "john-doe",
    name: "John Doe",
    role: "CEO & Founder",
    image: "/team/john-doe.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    role: "Head of Operations",
    image: "/team/jane-smith.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    role: "Technical Director",
    image: "/team/mike-johnson.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
]

export function AboutContent() {
  const { data: session } = useSession()
  console.log("SESSION DEBUG:", session);
  const [storyContent, setStoryContent] = useState("")
  const [missionContent, setMissionContent] = useState("")
  const [visionContent, setVisionContent] = useState("")
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS)
  const [isLoading, setIsLoading] = useState(true)
  

  // Dialog states
  const [storyDialogOpen, setStoryDialogOpen] = useState(false)
  const [missionDialogOpen, setMissionDialogOpen] = useState(false)
  const [visionDialogOpen, setVisionDialogOpen] = useState(false)
  const [editedStory, setEditedStory] = useState("")
  const [editedMission, setEditedMission] = useState("")
  const [editedVision, setEditedVision] = useState("")

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true)
      const [story, mission, vision] = await Promise.all([
        getPageContent("about-story"),
        getPageContent("about-mission"),
        getPageContent("about-vision")
      ])

      // Fetch team member content
      const updatedTeamMembers = await Promise.all(
        INITIAL_TEAM_MEMBERS.map(async (member) => {
          const [name, role, description, image] = await Promise.all([
            getPageContent(`team-${member.id}-name`),
            getPageContent(`team-${member.id}-role`),
            getPageContent(`team-${member.id}-description`),
            getPageContent(`team-${member.id}-image`)
          ])

          return {
            ...member,
            name: name || member.name,
            role: role || member.role,
            description: description || member.description,
            image: image || member.image
          }
        })
      )

      setStoryContent(story || "Founded in 2024, we set out to revolutionize the online shopping experience. Our mission is to provide high-quality products with exceptional customer service.")
      setMissionContent(mission || "To provide customers with the best shopping experience through innovative technology and exceptional service.")
      setVisionContent(vision || "To become the leading e-commerce platform known for quality, reliability, and customer satisfaction.")
      setTeamMembers(updatedTeamMembers)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleStorySave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    try {
      const result = await updatePageContent("about-story", editedStory)
      if (result.success) {
        setStoryContent(editedStory)
        setStoryDialogOpen(false)
        fetchContent() // Refresh all content
      } else {
        toast.error(result.error || "Failed to update story")
      }
    } catch (error) {
      console.error('Error saving story:', error)
      toast.error("Failed to update story")
    }
  }

  const handleMissionSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    try {
      const result = await updatePageContent("about-mission", editedMission)
      if (result.success) {
        setMissionContent(editedMission)
        setMissionDialogOpen(false)
        fetchContent() // Refresh all content
      } else {
        toast.error(result.error || "Failed to update mission")
      }
    } catch (error) {
      console.error('Error saving mission:', error)
      toast.error("Failed to update mission")
    }
  }

  const handleVisionSave = async () => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Unauthorized - Admin access required")
      return
    }
    try {
      const result = await updatePageContent("about-vision", editedVision)
      if (result.success) {
        setVisionContent(editedVision)
        setVisionDialogOpen(false)
        fetchContent() // Refresh all content
      } else {
        toast.error(result.error || "Failed to update vision")
      }
    } catch (error) {
      console.error('Error saving vision:', error)
      toast.error("Failed to update vision")
    }
  }

  const isAdmin = session?.user?.role === "ADMIN"

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>Building the future of e-commerce</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{storyContent}</p>
            {isAdmin && (
              <Dialog open={storyDialogOpen} onOpenChange={setStoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setEditedStory(storyContent)}
                  >
                    Edit Story
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Our Story</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="story">Story Content</Label>
                      <Textarea
                        id="story"
                        value={editedStory}
                        onChange={(e) => setEditedStory(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleStorySave} className="w-full">Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{missionContent}</p>
              {isAdmin && (
                <Dialog open={missionDialogOpen} onOpenChange={setMissionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedMission(missionContent)}
                    >
                      Edit Mission
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Our Mission</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mission">Mission Statement</Label>
                        <Textarea
                          id="mission"
                          value={editedMission}
                          onChange={(e) => setEditedMission(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleMissionSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{visionContent}</p>
              {isAdmin && (
                <Dialog open={visionDialogOpen} onOpenChange={setVisionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setEditedVision(visionContent)}
                    >
                      Edit Vision
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Our Vision</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vision">Vision Statement</Label>
                        <Textarea
                          id="vision"
                          value={editedVision}
                          onChange={(e) => setEditedVision(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleVisionSave} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              id={member.id}
              name={member.name}
              role={member.role}
              image={member.image}
              description={member.description}
              isAdmin={isAdmin}
              onUpdate={fetchContent}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 