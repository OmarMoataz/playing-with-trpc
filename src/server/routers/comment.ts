/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '~/server/prisma';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
});

export const commentRouter = router({
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        text: z.string().min(1),
        postId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    }),
});
