import { prisma } from '@/lib/prisma'

export const scanService = {
  /**
   * Record a face scan discovery
   */
  async recordScan(data: {
    scannerId: string
    scannedId: string
    latitude?: number
    longitude?: number
    locationName?: string
    scanConfidence: number
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create scan history
      const scan = await tx.scanHistory.create({
        data: {
          scannerId: data.scannerId,
          scannedId: data.scannedId,
          scanLatitude: data.latitude,
          scanLongitude: data.longitude,
          scanLocationName: data.locationName,
          scanConfidence: data.scanConfidence,
        },
        include: {
          scanned: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePictureUrl: true,
              bio: true,
              isVerified: true,
              socialLinks: {
                where: { isVisible: true },
              },
              interests: true,
            },
          },
        },
      })

      // Update trending user score (if exists)
      const trendingUser = await tx.trendingUser.findUnique({
        where: { userId: data.scannedId },
      })

      if (trendingUser) {
        await tx.trendingUser.update({
          where: { userId: data.scannedId },
          data: {
            scanCount24h: { increment: 1 },
            score: { increment: 5 }, // 5 points per scan
          },
        })
      } else {
        await tx.trendingUser.create({
          data: {
            userId: data.scannedId,
            scanCount24h: 1,
            score: 5,
            rank: 999999, // Will be calculated in batch job
          },
        })
      }

      // Create notification for scanned user
      await tx.notification.create({
        data: {
          userId: data.scannedId,
          fromUserId: data.scannerId,
          type: 'SCAN',
          content: 'Someone discovered you!',
        },
      })

      return scan
    })
  },

  /**
   * Get scan history for a user
   */
  async getUserScanHistory(userId: string, limit = 50, offset = 0) {
    return await prisma.scanHistory.findMany({
      where: {
        scannerId: userId,
      },
      include: {
        scanned: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            bio: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },

  /**
   * Get users who scanned me
   */
  async getWhoScannedMe(userId: string, limit = 50, offset = 0) {
    return await prisma.scanHistory.findMany({
      where: {
        scannedId: userId,
      },
      include: {
        scanner: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            bio: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },

  /**
   * Get trending users
   */
  async getTrendingUsers(limit = 20, offset = 0) {
    return await prisma.trendingUser.findMany({
      where: {
        user: {
          isActive: true,
          privacyLevel: 'PUBLIC',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePictureUrl: true,
            bio: true,
            isVerified: true,
            socialLinks: {
              where: { isVisible: true },
            },
          },
        },
      },
      orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
      skip: offset,
    })
  },

  /**
   * Check if user has been scanned by another user
   */
  async hasScanned(scannerId: string, scannedId: string) {
    const scan = await prisma.scanHistory.findFirst({
      where: {
        scannerId,
        scannedId,
      },
    })

    return !!scan
  },
}
