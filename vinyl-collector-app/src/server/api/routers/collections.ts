import { connect } from "http2";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { vinylInput } from "~/types";

export const collectionRouter = createTRPCRouter({
    all: protectedProcedure.query(async ({ctx}) => {
        const collections = await ctx.db.collection.findMany({
            where:{
                createdById: ctx.session.user.id,
            }
        });

        return collections
        // console.log('collections from prisma',  collections.map(({id, name}) => ({id, name})));
        // return [
        // {
        //     id: 'col1',
        //     name: 'Classic Rock',
        //     vinyls: [
        //         { id: 'v1', title: 'Abbey Road', artist: 'The Beatles', yearReleased: 1969 },
        //         { id: 'v2', title: 'Led Zeppelin IV', artist: 'Led Zeppelin', year: 1971 },
        //     ],
        // },
        // {
        //     id: 'col2',
        //     name: 'Jazz Essentials',
        //     vinyls: [
        //         { id: 'v3', title: 'Kind of Blue', artist: 'Miles Davis', yearReleased: 1959 },
        //         { id: 'v4', title: 'Blue Train', artist: 'John Coltrane', yearReleased: 1957 },
        //     ],
        // },
        // {
        //     id: 'col3',
        //     name: 'Modern Indie',
        //     vinyls: [
        //         { id: 'v5', title: 'AM', artist: 'Arctic Monkeys', yearReleased: 2013 },
        //         { id: 'v6', title: 'Currents', artist: 'Tame Impala', yearReleased: 2015 },
        //     ],
        // },
        // ];
    }),

    create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
        return ctx.db.collection.create({
            data: {
                name: input,
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
        return ctx.db.collection.delete({
            where: {
                id: input
            }
        });
    }),

    allVinylsInCollection: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
        const vinyls = await ctx.db.vinyl.findMany({
            where: {collectionId: input},
        })
        return [{ id: 'v1', title: 'Abbey Road', artist: 'The Beatles', yearReleased: 1969 },
                { id: 'v2', title: 'Led Zeppelin IV', artist: 'Led Zeppelin', yearReleased: 1971 },];
    }),

    addVinylToCollection: protectedProcedure
    .input(z.object({
        vinylId: z.string(),
        collectionId: z.string()
    }))
    .mutation(async ({ ctx, input}) => {
        const updatedVinyl = await ctx.db.vinyl.update({
            where: {id: input.vinylId},
            data: {collectionId: input.collectionId},
        });
        return updatedVinyl
    }),

    removeVinylFromCollection: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
        const updatedVinyl = await ctx.db.vinyl.update({
            where: {id: input},
            data: {collectionId: null}
        })
    })
});