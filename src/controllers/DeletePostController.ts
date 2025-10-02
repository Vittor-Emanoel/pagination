import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { query } from "../db/index.js";

const schema = z.object({
  id: z.coerce.string().min(1),
});

export class DeletePostController {
  static async handler(request: FastifyRequest, reply: FastifyReply) {
    const { success, data, error } = schema.safeParse(request.params);

    if (!success) {
      return reply.code(400).send({
        errors: error.issues,
      });
    }

    const { id } = data;

    await query("DELETE FROM posts WHERE id = $1", [id]);

    await query(
      `UPDATE system_summary
      SET total_count = total_count - 1
      WHERE entity = $1;`,
      ["posts"],
    );

    reply.code(204);
  }
}
