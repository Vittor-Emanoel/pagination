import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { query } from "../db/index.js";

const schema = z.object({
  page: z.coerce.number().min(1),
  perPage: z.coerce.number().min(10).max(50),
});

export class ListPostsController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { success, data, error } = schema.safeParse(request.query);

    if (!success) {
      return reply.code(400).send({
        errors: error.issues,
      });
    }

    const { page, perPage } = data;

    const { rows: posts } = await query("SELECT * FROM posts OFFSET 3 LIMIT 2");

    reply.send({ data, posts });
  }
}
