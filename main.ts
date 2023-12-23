import { io } from "npm:socket.io-client@4.7.2";

const socket = io("ws://localhost:4002");

socket.on("connect", () => {
  console.log("Connected to Rocinance Core Service");

  socket.on("PROJECT_START", (data: any) => {
  });

  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});
