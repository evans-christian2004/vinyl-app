import { randomUUID } from "crypto";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const themeInput = z.object({
  fontColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderStyle: z.string().optional(),
});

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);

const ensureMasterCollection = async (ctx: any) => {
  const slug = `master-${ctx.session.user.id}`;
  return ctx.db.collection.upsert({
    where: { slug },
    update: {},
    create: {
      name: "Master Collection",
      slug,
      isMaster: true,
      createdById: ctx.session.user.id,
    },
  });
};

export const collectionRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    await ensureMasterCollection(ctx);

    return ctx.db.collection.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { vinyls: true } },
      },
    });
  }),

  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const slugBase = slugify(input) || "collection";
      const slug = `${slugBase}-${Math.random().toString(36).slice(2, 7)}`;

      return ctx.db.collection.create({
        data: {
          name: input,
          slug,
          shareToken: randomUUID(),
          createdById: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findUnique({
        where: { id: input },
      });

      if (!collection || collection.createdById !== ctx.session.user.id) {
        throw new Error("Collection not found");
      }

      if (collection.isMaster) {
        throw new Error("Cannot delete master collection");
      }

      await ctx.db.collection.delete({
        where: { id: input },
      });

      return { success: true };
    }),

  vinylsInCollection: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: { id: input, createdById: ctx.session.user.id },
        include: {
          vinyls: {
            include: {
              userVinyl: {
                include: { globalVinyl: true },
              },
            },
          },
        },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      return collection.vinyls;
    }),

  addVinylToCollection: protectedProcedure
    .input(
      z.object({
        userVinylId: z.string(),
        collectionId: z.string(),
        theme: themeInput.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [collection, userVinyl] = await Promise.all([
        ctx.db.collection.findFirst({
          where: { id: input.collectionId, createdById: ctx.session.user.id },
        }),
        ctx.db.userVinyl.findUnique({
          where: { id: input.userVinylId },
        }),
      ]);

      if (!collection) {
        throw new Error("Collection not found");
      }

      if (!userVinyl || userVinyl.userId !== ctx.session.user.id) {
        throw new Error("Vinyl must be in user's master collection");
      }

      return ctx.db.collectionVinyl.create({
        data: {
          collectionId: collection.id,
          userVinylId: userVinyl.id,
          fontColor: input.theme?.fontColor,
          backgroundColor: input.theme?.backgroundColor,
          borderStyle: input.theme?.borderStyle,
        },
        include: {
          userVinyl: { include: { globalVinyl: true } },
        },
      });
    }),

  removeVinylFromCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        userVinylId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: { id: input.collectionId, createdById: ctx.session.user.id },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      await ctx.db.collectionVinyl.delete({
        where: {
          collectionId_userVinylId: {
            collectionId: input.collectionId,
            userVinylId: input.userVinylId,
          },
        },
      });

      return { success: true };
    }),

  updateTheme: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        userVinylId: z.string(),
        theme: themeInput,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findFirst({
        where: { id: input.collectionId, createdById: ctx.session.user.id },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      return ctx.db.collectionVinyl.update({
        where: {
          collectionId_userVinylId: {
            collectionId: input.collectionId,
            userVinylId: input.userVinylId,
          },
        },
        data: {
          fontColor: input.theme.fontColor,
          backgroundColor: input.theme.backgroundColor,
          borderStyle: input.theme.borderStyle,
        },
        include: {
          userVinyl: { include: { globalVinyl: true } },
        },
      });
    }),

  getByShareToken: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findUnique({
        where: { shareToken: input },
        include: {
          vinyls: {
            include: {
              userVinyl: {
                include: { globalVinyl: true },
              },
            },
          },
        },
      });

      if (!collection) {
        throw new Error("Collection not found");
      }

      return collection;
    }),
});
