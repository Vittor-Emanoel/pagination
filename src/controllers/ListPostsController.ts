import type { FastifyReply, FastifyRequest } from "fastify";
import { query } from "../db/index.js";

export class ListPostsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { rows: posts } = await query("SELECT * FROM posts");

    reply.send({ posts });
  }
}
