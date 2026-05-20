import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // Vercel Hobby plan caps at 60s; higher fails deploy

const MODEL_VERSIONS: Record<string, `${string}/${string}:${string}`> = {
  canny: 'jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613',
  depth: 'jagilley/controlnet-depth2img:922c7f7b1d72f02cc99ce9aabe687e3f86e890ed27d75c2d49b1de2eb84e7b8a',
  seg: 'jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d',
  none: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
}

type Body = {
  sourceImageDataUrl: string
  maskImageDataUrl?: string
  prompt: string
  negativePrompt?: string
  controlnet?: keyof typeof MODEL_VERSIONS
  variantCount?: number
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body.sourceImageDataUrl || !body.prompt) {
    return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 })
  }

  const token = process.env.REPLICATE_API_TOKEN
  // No token → echo the source back as "variants" so the UI flow still works.
  if (!token) {
    return NextResponse.json({
      mocked: true,
      variants: Array.from({ length: body.variantCount ?? 4 }, (_, i) => ({
        url: body.sourceImageDataUrl,
        seed: i + 1,
      })),
    })
  }

  try {
    const { default: Replicate } = await import('replicate')
    const replicate = new Replicate({ auth: token })
    const version = MODEL_VERSIONS[body.controlnet ?? 'canny'] ?? MODEL_VERSIONS.canny

    const input: Record<string, unknown> = {
      image: body.sourceImageDataUrl,
      prompt: body.prompt,
      num_outputs: body.variantCount ?? 4,
      num_inference_steps: 30,
    }
    if (body.negativePrompt) input.negative_prompt = body.negativePrompt
    if (body.maskImageDataUrl) input.mask = body.maskImageDataUrl

    const output = (await replicate.run(version, { input })) as unknown
    const urls: string[] = Array.isArray(output)
      ? (output as string[])
      : typeof output === 'string'
        ? [output]
        : []

    return NextResponse.json({
      variants: urls.map((url, i) => ({ url, seed: i })),
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 })
  }
}
