import { io } from "npm:socket.io-client@4.7.2";
import { processFlags } from "https://deno.land/x/flags_usage/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

const options = {
  description: {
    api: "rocinante core service url",
    socket: "rocinante core wss url",
    name: "name of project",
    version: "version of project",
  },
  argument: {
    api: "dir",
    socket: "dir",
    name: "dir",
    version: "dir",
  },
  string: ["api", "socket", "name", "version"],
};

const { api, socket, name, version } = processFlags(Deno.args, options);
const socketConn = io(socket);

enum TopicNames {
  PROJECT_START = "PROJECT_START",
}

if (!name || !version || !socket) {
  console.error("some arguments missing!! please check you're arguments.");
  Deno.exit(1);
}

socketConn.on("connect", () => {
  axiod.post(`${api}/projects/start`, {
    name,
    version,
  })
    .then((response) => {
      //TODO Set env with returned host
      console.log(response);
      Deno.exit(1)
    })
    .catch((error) => {
      console.error(error.response.data);
      Deno.exit(1)
    });

  socketConn.on(TopicNames.PROJECT_START, (data: string) => {
    console.log("::: ", data);
  });
});
