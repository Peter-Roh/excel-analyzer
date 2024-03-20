import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const dataRouter = createTRPCRouter({
  // upload: publicProcedure.input().mutation(),
  analyze: publicProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ input: { question } }) => {
      const res = (await (
        await fetch("http://127.0.0.1:5328/api/py/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: question,
          }),
        })
      ).json()) as Record<string, string>;

      return {
        data: res.data,
      };
    }),
});
