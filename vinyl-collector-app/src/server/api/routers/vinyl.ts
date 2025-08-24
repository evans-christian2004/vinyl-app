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
        return vinyls
        
    //     return [
    //   {
    //     id: 'testID1',
    //     title: 'testVinyl',
    //     artist:  'fakeArtist',
    //     yearReleased: 1999,
    //     genre: null,
    //     imageUrl: null,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     collectionId: null,
    //     createdById: 'testUser1',
    //   },
    //   {
    //     id: 'testID2',
    //     title: 'testViny2l',
    //     artist:  'fakeArtist2',
    //     yearReleased: 2000,
    //     genre: null,
    //     imageUrl: null,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     collectionId: null,
    //     createdById: 'testUser2',
    //   },
    // ]
        // console.log('vinyls from prisma',  vinyls.map(({id, title, artist}) => ({id, title, artist})));
        
    }),

    create: protectedProcedure
    .input(vinylInput)
    .mutation(async ({ ctx, input }) => {
        return ctx.db.vinyl.create({
            data: {
                title: input.title,
                artist: input.artist,
                condition: input.condition,
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