import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const dataRouter = createTRPCRouter({
  analyze: publicProcedure
    .input(z.object({ path: z.string(), question: z.string() }))
    .mutation(async ({ input: { path, question } }) => {
      const res = (await (
        await fetch("http://127.0.0.1:5328/api/py/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path,
            question,
          }),
        })
      ).json()) as Record<string, string>;

      return {
        data: res.data,
      };
    }),
});
