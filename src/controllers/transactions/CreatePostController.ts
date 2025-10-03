import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { transaction } from "../../db/index.js";

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

    try {
      await transaction(async (tx) => {
        const [
          {
            rows: [post],
          },
        ] = await Promise.all([
          tx.query(
            `
            INSERT INTO posts(title, content)
            VALUES ($1, $2)
            RETURNING *
          `,
            [title, content],
          ),
          tx.query(
            `
          UPDATE system_summary
          SET total_count = total_count + 1
          WHERE entity = $1;
          `,
            ["posts"],
          ),
        ]);
        reply.code(201).send({ post });
      });
    } catch {
      reply.code(500).send({ error: "Deu ruim!" });
    }
  }
}
