import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}
let userCount = 0;
let allWs: User[] = [];

wss.on("connection", (socket) => {
  userCount++;
  console.log(userCount);
  socket.on("message", (message) => {
    // @ts-ignore
    const jsondata = JSON.parse(message.toString());
    if (jsondata.type === "join") {
      if (jsondata.payload.roomid == "") {
        return;
      } else {
        allWs.push({ socket, room: jsondata.payload.roomid });
        console.log("user joined the room :" + jsondata.payload.roomid);
      }
    }
    if (jsondata.type == "chat") {
      const user = allWs.find((x) => x.socket == socket);
      if (!user) {
        console.log("User not found in any room");
        return;
      }
      const currentRoom = user?.room;
      for (let i = 0; i < allWs.length; i++) {
        if (allWs[i]?.room === currentRoom) {
          allWs[i]?.socket.send(
            JSON.stringify({
              name: jsondata.payload.name,
              message: jsondata.payload.message,
            })
          );
        }
      }
    }
  });
  socket.on("close", () => {
    userCount--;
    allWs = allWs.filter((user) => user.socket !== socket);
    console.log(userCount);
  });
});
