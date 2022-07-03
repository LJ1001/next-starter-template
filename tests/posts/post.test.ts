/**
 * Integration test example for the `post` router
 */
import { test, expect, afterEach } from 'vitest'
import { createContextInner } from '../../src/server/context'
import { appRouter } from '../../src/server/routers/_app'
import { inferMutationInput } from '~/utils/trpc'
import {  PrismaClient } from '@prisma/client'

const ctx = await createContextInner({})
const caller = appRouter.createCaller(ctx)
const client = new PrismaClient()

afterEach(async () => {
  await client.$executeRawUnsafe('TRUNCATE TABLE Post')
})

test('add and get post', async () => {
  const input: inferMutationInput<'post.add'> = {
    text: 'hello test',
    title: 'hello test',
  }
  const post = await caller.mutation('post.add', input)
  const byId = await caller.query('post.byId', {
    id: post.id,
  })
  const all = await caller.query('post.all')
  expect(all.length).toBe(1)

  expect(byId).toMatchObject(input)
})
