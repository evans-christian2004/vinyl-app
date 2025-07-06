import { connect } from "http2";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { vinylInput } from "~/types";

export const vinylRouter = createTRPCRouter({
    all: protectedProcedure.query(async ({ctx}) => {
        const vinyls = await ctx.db.vinyl.findMany({
            where:{
                createdById: ctx.session.user.id,
            }
        });
        console.log('vinyls from prisma',  vinyls.map(({id, title, artist}) => ({id, title, artist})));
        return [
        {
            id: 'testID1',
            title: 'testVinyl',
            artist:  'fakeArtist',
            yearReleased: 1999,
        },
        {
            id: 'testID2',
            title: 'testViny2l',
            artist:  'fakeArtist2',
            yearReleased: 2000,
        },
    ]
    }),

    create: protectedProcedure
    .input(vinylInput)
    .mutation(async ({ ctx, input }) => {
        return ctx.db.vinyl.create({
            data: {
                title: input.title,
                artist: input.artist,
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