import { PrismaClient } from '@prisma/client'
import { getFirebaseAuth } from '../server/lib/firebase'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'kwentasklarasboljoon@gmail.com'
  const adminPassword = 'Default@123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const firebaseAuth = getFirebaseAuth()
    const firebaseUser = await firebaseAuth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'Admin User',
      emailVerified: false,
    })

    const now = new Date()
    await prisma.user.create({
      data: {
        firebaseId: firebaseUser.uid,
        firstName: 'Admin',
        lastName: 'User',
        username: '@admin',
        email: adminEmail,
        role: 'admin',
        department: '',
        status: 'Active',
        joined: now,
        createdAt: now,
        updatedAt: now,
      },
    })
    console.log('Admin user seeded successfully')
  } else {
    console.log('Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

