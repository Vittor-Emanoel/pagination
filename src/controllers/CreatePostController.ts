import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { query } from "../db/index.js";

export class CreatePostController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      title: z.string().min(1).max(255),
      content: z.string().min(1),
    });

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

    reply.code(201).send({ post });
  }
}
