import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface UpdateVideoParams {
  params: {
    id: string
  }
}

const updateVideoBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  tags: z.array(z.string()).min(1),
  commitUrl: z.string().url().nullable(),
})

export async function PUT(request: Request, { params }: UpdateVideoParams) {
  const videoId = params.id
  const requestBody = await request.json()

  const { title, description, commitUrl, tags } =
    updateVideoBodySchema.parse(requestBody)

  try {
    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        title,
        description,
        commitUrl,
        tags: {
          connect: tags.map((tag) => {
            return {
              slug: tag,
            }
          }),
        },
      },
    })

    return new Response()
  } catch (err) {
    console.log(err)
  }
}
