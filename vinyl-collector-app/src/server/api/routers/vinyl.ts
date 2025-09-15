import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { vinylInput } from "~/types";

export const vinylRouter = createTRPCRouter({
    all: protectedProcedure.query(async ({ctx}) => {
        const vinyls = await ctx.db.vinyl.findMany()
        return vinyls
    }),
    
    
    allUser: protectedProcedure.query(async ({ctx}) => {
        const vinyls = await ctx.db.vinyl.findMany({
            where:{
                createdById: ctx.session.user.id,
            }
        });
        return vinyls;
    }),

    create: protectedProcedure
    .input(vinylInput)
    .mutation(async ({ ctx, input }) => {
        return ctx.db.vinyl.create({
            data: {
                title: input.title,
                artist: input.artist,
                color: input.color,
                edition: input.edition,
                condition: input.condition,
                yearReleased: input.yearReleased,
                createdBy: {
                    connect:{
                        id: ctx.session.user.id
                    },
                },
            },
        });
    }),

    delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
        return ctx.db.vinyl.delete({
            where: {
                id: input
            }
        });
    }),

});