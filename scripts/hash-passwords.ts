import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  try {
    // Get all users
    const users = await prisma.user.findMany()

    for (const user of users) {
      // Check if password is already hashed
      const isHashed = user.password.startsWith("$2a$") || user.password.startsWith("$2b$")
      
      if (!isHashed) {
        // Hash the password
        const hashedPassword = await hash(user.password, 10)
        
        // Update the user with the hashed password
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        })
        
        console.log(`Updated password for user: ${user.email}`)
      }
    }

    console.log("Password hashing completed")
  } catch (error) {
    console.error("Error hashing passwords:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 