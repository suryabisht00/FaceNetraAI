import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      vectorId: 'vec_test_123456',
      randomId: 'usr_test_abc',
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@facenetra.ai',
      bio: 'This is a test user account for development',
      isVerified: true,
    },
  })

  console.log('✅ Created test user:', testUser.username)

  // Create privacy settings
  await prisma.privacySettings.create({
    data: {
      userId: testUser.id,
    },
  })

  console.log('✅ Created privacy settings')

  // Create face vector (dummy data)
  await prisma.faceVector.create({
    data: {
      userId: testUser.id,
      vectorEmbedding: Buffer.from('dummy-face-vector-data'),
      vectorVersion: '1.0',
      isPrimary: true,
    },
  })

  console.log('✅ Created face vector')

  // Create user search index
  await prisma.userSearchIndex.create({
    data: {
      userId: testUser.id,
      searchText: 'Test User testuser development',
    },
  })

  console.log('✅ Created search index')

  // Create social links
  await prisma.userSocialLink.createMany({
    data: [
      {
        userId: testUser.id,
        platform: 'INSTAGRAM',
        username: 'testuser',
        profileUrl: 'https://instagram.com/testuser',
      },
      {
        userId: testUser.id,
        platform: 'TWITTER',
        username: 'testuser',
        profileUrl: 'https://twitter.com/testuser',
      },
    ],
  })

  console.log('✅ Created social links')

  // Create interests
  await prisma.userInterest.createMany({
    data: [
      {
        userId: testUser.id,
        interest: 'Technology',
        category: 'Tech',
      },
      {
        userId: testUser.id,
        interest: 'Photography',
        category: 'Creative',
      },
      {
        userId: testUser.id,
        interest: 'Travel',
        category: 'Lifestyle',
      },
    ],
  })

  console.log('✅ Created interests')

  // Create a test post
  await prisma.post.create({
    data: {
      userId: testUser.id,
      content: 'Welcome to FaceNetra! This is my first post. 🎉',
      postType: 'TEXT',
      visibility: 'PUBLIC',
    },
  })

  console.log('✅ Created test post')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
