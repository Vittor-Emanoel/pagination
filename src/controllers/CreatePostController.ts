import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { query } from "../db/index.js";

const schema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export class CreatePostController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { success, data, error } = schema.safeParse(request.body);

    if (!success) {
      return reply.code(400).send({
        errors: error.issues,
      });
    }

    const { title, content } = data;

    const {
      rows: [post],
    } = await query(
      `
      INSERT INTO posts(title, content)
      VALUES ($1, $2)
      RETURNING *
    `,
      [title, content],
    );

    await query(
      `
       UPDATE system_summary
      SET total_count = total_count + 1
      WHERE entity = $1;
      `,
      ["posts"],
    );

    reply.code(201).send({ post });
  }
}
