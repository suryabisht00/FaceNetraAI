import { prisma } from '@/lib/prisma'

export const connectionService = {
  /**
   * Send connection request
   */
  async sendConnectionRequest(userId: string, targetUserId: string, type: 'FRIEND' | 'FOLLOWING' = 'FRIEND') {
    // Check if connection already exists
    const existing = await prisma.connection.findUnique({
      where: {
        userId_connectedUserId: {
          userId,
          connectedUserId: targetUserId,
        },
      },
    })

    if (existing) {
      throw new Error('Connection already exists')
    }

    // Create connection request
    const connection = await prisma.$transaction(async (tx) => {
      const newConnection = await tx.connection.create({
        data: {
          userId,
          connectedUserId: targetUserId,
          connectionType: type,
          status: type === 'FOLLOWING' ? 'ACCEPTED' : 'PENDING',
        },
        include: {
          connectedUser: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePictureUrl: true,
              isVerified: true,
            },
          },
        },
      })

      // Create notification if FRIEND request
      if (type === 'FRIEND') {
        await tx.notification.create({
          data: {
            userId: targetUserId,
            fromUserId: userId,
            type: 'CONNECTION_REQUEST',
            content: 'sent you a friend request',
            targetType: 'connection',
            targetId: newConnection.id,
          },
        })
      }

      return newConnection
    })

    return connection
  },

  /**
   * Accept connection request
   */
  async acceptConnectionRequest(connectionId: string, userId: string) {
    // Verify the connection is for this user
    const connection = await prisma.connection.findFirst({
      where: {
        id: connectionId,
        connectedUserId: userId,
        status: 'PENDING',
      },
    })

    if (!connection) {
      throw new Error('Connection request not found')
    }

    return await prisma.$transaction(async (tx) => {
      // Update connection status
      const updatedConnection = await tx.connection.update({
        where: { id: connectionId },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              profilePictureUrl: true,
              isVerified: true,
            },
          },
        },
      })

      // Update trending score
      const trendingUser = await tx.trendingUser.findUnique({
        where: { userId: connection.userId },
      })

      if (trendingUser) {
        await tx.trendingUser.update({
          where: { userId: connection.userId },
          data: {
            newConnections24h: { increment: 1 },
            score: { increment: 10 }, // 10 points per new connection
          },
        })
      }

      // Create notification
      await tx.notification.create({
        data: {
          userId: connection.userId,
          fromUserId: userId,
          type: 'CONNECTION_ACCEPTED',
          content: 'accepted your friend request',
        },
      })

      // Update scan history if exists
      await tx.scanHistory.updateMany({
        where: {
          scannerId: connection.userId,
          scannedId: userId,
        },
        data: {
          connectionMade: true,
        },
      })

      return updatedConnection
    })
  },

  /**
   * Reject connection request
   */
  async rejectConnectionRequest(connectionId: string, userId: string) {
    const connection = await prisma.connection.findFirst({
      where: {
        id: connectionId,
        connectedUserId: userId,
        status: 'PENDING',
      },
    })

    if (!connection) {
      throw new Error('Connection request not found')
    }

    return await prisma.connection.update({
      where: { id: connectionId },
      data: { status: 'REJECTED' },
    })
  },

  /**
   * Remove connection
   */
  async removeConnection(userId: string, targetUserId: string) {
    return await prisma.connection.deleteMany({
      where: {
        OR: [
          { userId, connectedUserId: targetUserId },
          { userId: targetUserId, connectedUserId: userId },
        ],
      },
    })
  },

  /**
   * Get pending connection requests
   */
  async getPendingRequests(userId: string) {
    return await prisma.connection.findMany({
      where: {
        connectedUserId: userId,
        status: 'PENDING',
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  /**
   * Get user's friends
   */
  async getFriends(userId: string, limit = 100, offset = 0) {
    return await prisma.connection.findMany({
      where: {
        userId,
        connectionType: 'FRIEND',
        status: 'ACCEPTED',
      },
      include: {
        connectedUser: {
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
      orderBy: { acceptedAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },

  /**
   * Get users I'm following
   */
  async getFollowing(userId: string, limit = 100, offset = 0) {
    return await prisma.connection.findMany({
      where: {
        userId,
        connectionType: 'FOLLOWING',
        status: 'ACCEPTED',
      },
      include: {
        connectedUser: {
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
   * Get my followers
   */
  async getFollowers(userId: string, limit = 100, offset = 0) {
    return await prisma.connection.findMany({
      where: {
        connectedUserId: userId,
        connectionType: 'FOLLOWING',
        status: 'ACCEPTED',
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  },

  /**
   * Block user
   */
  async blockUser(userId: string, targetUserId: string) {
    // Remove existing connections
    await this.removeConnection(userId, targetUserId)

    // Create block connection
    return await prisma.connection.create({
      data: {
        userId,
        connectedUserId: targetUserId,
        connectionType: 'BLOCKED',
        status: 'ACCEPTED',
      },
    })
  },

  /**
   * Unblock user
   */
  async unblockUser(userId: string, targetUserId: string) {
    return await prisma.connection.deleteMany({
      where: {
        userId,
        connectedUserId: targetUserId,
        connectionType: 'BLOCKED',
      },
    })
  },
}
