import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const globalVinylInput = z.object({
  title: z.string(),
  artist: z.string(),
  color: z.string().optional(),
  edition: z.string().optional(),
  yearReleased: z.number().int().optional(),
  imageUrl: z.string().url().optional(),
});

const overrideInput = z
  .object({
    title: z.string().optional(),
    artist: z.string().optional(),
    color: z.string().optional(),
    yearReleased: z.number().int().optional(),
    imageUrl: z.string().url().optional(),
  })
  .partial();

const addToMasterInput = z
  .object({
    globalVinylId: z.string().optional(),
    globalVinyl: globalVinylInput.optional(),
    price: z.number().optional(),
    condition: z.string().optional(),
    overrides: overrideInput.optional(),
  })
  .refine(
    (val) => val.globalVinylId || val.globalVinyl,
    "Provide an existing globalVinylId or data to create a new global vinyl entry.",
  );

export const vinylRouter = createTRPCRouter({
  catalog: publicProcedure
    .input(z.object({ query: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const query = input?.query;
      const where: Prisma.GlobalVinylWhereInput | undefined = query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                artist: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                color: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : undefined;

      return ctx.db.globalVinyl.findMany({
        where,
        orderBy: { title: "asc" },
      });
    }),

  allUserMaster: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userVinyl.findMany({
      where: { userId: ctx.session.user.id },
      include: { globalVinyl: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  addToMaster: protectedProcedure
    .input(addToMasterInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const globalVinyl =
        input.globalVinylId ??
        (
          await ctx.db.globalVinyl.create({
            data: {
              title: input.globalVinyl!.title,
              artist: input.globalVinyl!.artist,
              color: input.globalVinyl!.color,
              edition: input.globalVinyl!.edition,
              yearReleased: input.globalVinyl!.yearReleased,
              imageUrl: input.globalVinyl!.imageUrl,
            },
          })
        ).id;

      const userVinyl = await ctx.db.userVinyl.upsert({
        where: {
          userId_globalVinylId: {
            userId,
            globalVinylId: globalVinyl,
          },
        },
        update: {
          price: input.price,
          condition: input.condition,
          overrideTitle: input.overrides?.title,
          overrideArtist: input.overrides?.artist,
          overrideColor: input.overrides?.color,
          overrideYear: input.overrides?.yearReleased,
          overrideImageUrl: input.overrides?.imageUrl,
        },
        create: {
          userId,
          globalVinylId: globalVinyl,
          price: input.price,
          condition: input.condition,
          overrideTitle: input.overrides?.title,
          overrideArtist: input.overrides?.artist,
          overrideColor: input.overrides?.color,
          overrideYear: input.overrides?.yearReleased,
          overrideImageUrl: input.overrides?.imageUrl,
        },
        include: { globalVinyl: true },
      });

      return userVinyl;
    }),

  deleteFromMaster: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userVinyl = await ctx.db.userVinyl.findUnique({
        where: { id: input },
        select: { userId: true, globalVinylId: true },
      });

      if (!userVinyl || userVinyl.userId !== userId) {
        throw new Error("Vinyl not found or not owned by user");
      }

      await ctx.db.userVinyl.delete({ where: { id: input } });

      const remaining = await ctx.db.userVinyl.count({
        where: { globalVinylId: userVinyl.globalVinylId },
      });

      if (remaining === 0) {
        await ctx.db.globalVinyl.delete({
          where: { id: userVinyl.globalVinylId },
        });
      }

      return { success: true };
    }),
});
