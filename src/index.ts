import Fastify from "fastify";
import { CreatePostController } from "./controllers/CreatePostController.js";
import { ListPostsController } from "./controllers/ListPostsController.js";

const fastify = Fastify();

fastify.get("/posts", ListPostsController.handler);

fastify.post("/posts", CreatePostController.handler);

fastify
  .listen({ port: 3000 })
  .then(() => console.log("> Server is running at http://localhost:3000"))
  .catch((e) => console.log(e));
