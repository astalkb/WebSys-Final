import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

async function clearOrders() {
  try {
    // Log the database URL (without sensitive info)
    console.log('Connected to database:', process.env.DATABASE_URL?.split('@')[1])

    // Count orders before deletion
    const orderCount = await prisma.order.count()
    console.log(`Found ${orderCount} orders to delete`)

    // Count order items before deletion
    const itemCount = await prisma.orderItem.count()
    console.log(`Found ${itemCount} order items to delete`)

    // Delete all order items first (due to foreign key constraints)
    const deletedItems = await prisma.orderItem.deleteMany({})
    console.log(`Deleted ${deletedItems.count} order items`)

    // Delete all orders
    const deletedOrders = await prisma.order.deleteMany({})
    console.log(`Deleted ${deletedOrders.count} orders`)

    // Verify deletion
    const remainingOrders = await prisma.order.count()
    const remainingItems = await prisma.orderItem.count()
    console.log(`Remaining orders: ${remainingOrders}`)
    console.log(`Remaining items: ${remainingItems}`)

    console.log('Successfully cleared all orders and related data')
  } catch (error) {
    console.error('Error clearing orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearOrders() 