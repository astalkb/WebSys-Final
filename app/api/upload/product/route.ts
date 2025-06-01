import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueId = uuidv4()
    const extension = file.name.split('.').pop()
    const filename = `${productId}-${uniqueId}.${extension}`

    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'products')
    const filepath = join(publicDir, filename)
    await writeFile(filepath, buffer)

    // Return the URL path
    return NextResponse.json({ url: `/products/${filename}` })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
} 