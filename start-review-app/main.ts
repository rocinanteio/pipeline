import { io } from "npm:socket.io-client@4.7.2";
import { processFlags } from "https://deno.land/x/flags_usage/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

import {generateProjectName} from "../constants.ts";

const options = {
  description: {
    api: "rocinante core service url",
    socket: "rocinante core wss url",
    name: "name of project",
    image: "docker image of project",
    appPort: "appPort of project",
  },
  argument: {
    api: "dir",
    socket: "dir",
    name: "dir",
    image: "dir",
    appPort: "dir",
  },
  string: ["api", "socket", "name", "image", "appPort"],
};

const { api, socket, name, image, appPort } = processFlags(Deno.args, options);
const socketConn = io(socket);



if (!name || !image || !socket || !appPort) {
  console.error("some arguments missing!! please check you're arguments.");
  Deno.exit(1);
}

socketConn.on("connect", () => {
  axiod.post(`${api}/projects/start/image`, undefined, {
    params: {
      name: generateProjectName(name),
      image,
      appPort
    }
  })
    .then(() => {
      setTimeout(() => {
        Deno.exit(1)
      }, 2000)
    })
    .catch((error) => {
      console.error(error.response.data);
      Deno.exit(1)
    });

  socketConn.on(name, (data: string) => {
    console.log("::: ", data);
  });
});
