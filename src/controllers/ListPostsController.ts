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

    const offset = (page - 1) * perPage;

    const [
      {
        rows: [total],
      },
      { rows: posts },
    ] = await Promise.all([
      query("SELECT COUNT(id) FROM posts"),
      query("SELECT * FROM posts OFFSET $1 LIMIT $2", [offset, perPage]),
    ]);

    const postsCount = Number(total.count);
    const totalPages = Math.ceil(postsCount / perPage);

    reply.send({ postsCount, totalPages, posts });
  }
}
