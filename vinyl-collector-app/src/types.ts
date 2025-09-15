import { z } from 'zod';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './server/api/root';

type RouterOutputs = inferRouterOutputs<AppRouter>;
type allVinylsOutput = RouterOutputs['vinyl']["all"];

export type allVinyls = allVinylsOutput[number];

export type Vinyl = {
  id: string;
  title: string;
  artist: string;
  color?: string | null;
  edition?: string | null;
  yearReleased?: number | null;
  condition: string;
  genre?: string | null;
  imageUrl?: string | null;
  createdAt?: Date; // or Date, depending on your usage
  updatedAt?: Date; // or Date
  collectionId?: string | null;
  createdById?: string;
};

export const vinylInput = z.object({
  title: z.string(),
  artist: z.string(),
  color: z.string().optional(),
  edition: z.string().optional(),
  yearReleased: z.number().int().min(1948), //restricting vinyls to earliest year
  condition: z.string(),
});
