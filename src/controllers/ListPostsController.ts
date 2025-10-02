import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { query } from "../db/index.js";

const schema = z.object({
  cursor: z.coerce.number().min(1).optional(),
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

    const { cursor, perPage } = data;

    const [
      {
        rows: [total],
      },
      { rows: posts },
    ] = await Promise.all([
      query("SELECT COUNT(id) FROM posts"),
      query("SELECT * FROM posts WHERE id > $1 ORDER BY id ASC LIMIT $2", [
        cursor ?? 0,
        perPage,
      ]),
    ]);

    const postsCount = Number(total.count);
    const totalPages = Math.ceil(postsCount / perPage);
    const nextCursor = posts.at(-1).id;

    reply.send({ postsCount, nextCursor, totalPages, posts });
  }
}
