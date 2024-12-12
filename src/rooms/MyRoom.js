import { Room } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
  maxClients = 10;

  onCreate(options) {
    this.roomId = options.metaverseId;
    this.setState(new MyRoomState());

    console.log("Room created!", options,this.roomId);

    this.onMessage("move", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.prevX = player.x;
        player.prevY = player.y;
        player.prevZ = player.z;
        player.prevRotationY = player.rotationY;

        player.x = message.x;
        player.y = message.y;
        player.z = message.z;
        player.rotationY = message.rotationY;
        player.animationState = message.animationState;
      }
    });
  }

  onJoin(client, options) {
    console.log(client.sessionId, "joined room", this.roomId);
    const newPlayer = new Player();
    newPlayer.x = 0;
    newPlayer.y = 0;
    newPlayer.z = 0;
    newPlayer.rotationY = 0;
    newPlayer.prevX = 0;
    newPlayer.prevY = 0;
    newPlayer.prevZ = 0;
    newPlayer.prevRotationY = 0;
    newPlayer.avatarUrl = options.avatarUrl || "default_avatar_url";
    newPlayer.gender = options.gender || "Male";
    newPlayer.animationState = "IDLE";
    this.state.players.set(client.sessionId, newPlayer);
  }

  onLeave(client, consented) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}

