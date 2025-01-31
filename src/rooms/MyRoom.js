import { Room } from "@colyseus/core"
import { MyRoomState, Player } from "./schema/MyRoomState.js"

export class MyRoom extends Room {
  maxClients = 10

  onCreate(options) {
    this.roomId = options.metaverseId
    this.setState(new MyRoomState())

    console.log("Room created!", options, this.roomId)

    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId)
      if (player) {
        player.prevX = player.x
        player.prevY = player.y
        player.prevZ = player.z
        player.prevRotationY = player.rotationY

        player.x = message.x
        player.y = message.y
        player.z = message.z
        player.rotationY = message.rotationY
        player.animationState = message.animationState
      }
    })

    this.onMessage("chat", (client, message) => {
      const player = this.state.players.get(client.sessionId)
      this.broadcast("chat", {
        sessionId: client.sessionId,
        playerName: player.playerName,
        avatarUrl: player.avatarUrl.replace(".glb", ".png"),
        message: message.text,
      })
    })

    this.onMessage("removePlayer", (client, message) => {
      const adminPlayer = this.state.players.get(client.sessionId)
      if (adminPlayer && adminPlayer.isAdmin) {
        const playerToRemove = this.clients.find((c) => c.auth.uid === message.uid)
        if (playerToRemove) {
          playerToRemove.leave()
          console.log(`Admin ${adminPlayer.playerName} removed player ${playerToRemove.sessionId}`)
        }
      }
    })

    this.onMessage("makeAdmin", (client, message) => {
      const adminPlayer = this.state.players.get(client.sessionId)
      if (adminPlayer && adminPlayer.isAdmin) {
        const playerToPromote = this.state.players.get(this.clients.find((c) => c.auth.uid === message.uid)?.sessionId)
        if (playerToPromote) {
          playerToPromote.isAdmin = true
          this.broadcast("adminUpdate", { uid: playerToPromote.uid, isAdmin: true })
          console.log(`Admin ${adminPlayer.playerName} promoted player ${playerToPromote.playerName} to admin`)
        }
      }
    })
  }

  onJoin(client, options) {
    console.log(client.sessionId, "joined room", this.roomId)
    const newPlayer = new Player()
    newPlayer.x = 0
    newPlayer.y = 0
    newPlayer.z = 0
    newPlayer.rotationY = 0
    newPlayer.prevX = 0
    newPlayer.prevY = 0
    newPlayer.prevZ = 0
    newPlayer.prevRotationY = 0
    newPlayer.avatarUrl = options.avatarUrl || "default_avatar_url"
    newPlayer.gender = options.gender || "Male"
    newPlayer.animationState = "IDLE"
    newPlayer.playerName = options.playerName || "Anonymous"
    newPlayer.isAdmin = options.isAdmin || false
    newPlayer.uid = options.uid
    this.state.players.set(client.sessionId, newPlayer)

    // Store uid in client.auth for easy access
    client.auth = { uid: newPlayer.uid }
  }

  onLeave(client, consented) {
    console.log(client.sessionId, "left!")
    this.state.players.delete(client.sessionId)
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...")
  }
}

