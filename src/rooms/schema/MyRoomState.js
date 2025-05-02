import { Schema, MapSchema, defineTypes } from "@colyseus/schema"

class Player extends Schema {}

defineTypes(Player, {
  x: "number",
  y: "number",
  z: "number",
  rotationY: "number",
  prevX: "number",
  prevY: "number",
  prevZ: "number",
  prevRotationY: "number",
  avatarUrl: "string",
  gender: "string",
  animationState: "string",
  playerName: "string",
  isAdmin: "boolean",
  uid: "string",
  handRaised: "boolean",
  spatial: "boolean",
})

class MyRoomState extends Schema {
  constructor() {
    super()
    this.players = new MapSchema()
  }
}

defineTypes(MyRoomState, {
  players: { map: Player },
})

export { MyRoomState, Player }

