// Mock Socket.IO implementation
class SocketManager {
  private static instance: SocketManager
  private sockets: Map<string, any> = new Map()
  private users: Map<string, { id: string; name: string; role: string; socketId: string }> = new Map()

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  public connect(userId: string, role: string): any {
    const socketId = `socket_${userId}_${Date.now()}`

    // Create mock user
    const user = {
      id: userId,
      name: role === "staff" ? `Staff ${userId.slice(0, 4)}` : `User ${userId.slice(0, 4)}`,
      role,
      socketId,
    }

    this.users.set(userId, user)

    // Create mock socket
    const mockSocket = {
      id: socketId,
      on: (event: string, callback: Function) => {
        // Simulate connection
        if (event === "connect") {
          setTimeout(() => callback(), 500)
        }

        // Simulate online users
        if (event === "online_users") {
          setTimeout(() => {
            callback({
              count: this.users.size,
              users: Array.from(this.users.values()),
            })
          }, 1000)
        }
      },
      off: (event: string) => {
        // No-op for mock
      },
      emit: (event: string, data: any) => {
        // No-op for mock
      },
    }

    this.sockets.set(userId, mockSocket)
    return mockSocket
  }

  public sendMessage(message: any): void {
    // Simulate sending a message
    console.log("Message sent:", message)
  }

  public disconnect(userId: string): void {
    this.sockets.delete(userId)
    this.users.delete(userId)
  }
}

export default SocketManager
