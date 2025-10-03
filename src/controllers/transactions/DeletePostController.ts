import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { transaction } from "../../db/index.js";

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

    try {
      await transaction(async (tx) => {
        const { rowCount } = await tx.query("DELETE FROM posts WHERE id = $1", [
          id,
        ]);

        if (rowCount && rowCount > 0) {
          await tx.query(
            `UPDATE system_summary
        SET total_count = total_count - $1
        WHERE entity = 'posts';`,
            [rowCount],
          );
          reply.code(204);
        }
      });
    } catch (error) {
      reply.code(500).send({ error: "deu ruim" });
    }
  }
}
