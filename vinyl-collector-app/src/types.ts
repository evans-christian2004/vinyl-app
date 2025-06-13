import { Artifika } from 'next/font/google';
import { z } from 'zod';

export const vinylInput = z.object({
    title: z.string(),
    artist: z.string(),
})
