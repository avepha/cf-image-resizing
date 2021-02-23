import s3 from './s3'
import { PassThrough, Readable } from 'stream'
import sharp from 'sharp'


export function getBucketFromDomainName(domainName): string | undefined {
  const matches = /(.+)\.s3\.amazonaws\.com/.exec(domainName)
  return matches !== null
    ? matches[1]
    : undefined
}

type Fit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
type ExtractPathOutput = {
  name: string
  ext: string
  width: number
  height: number
  fit: Fit
}

export function extractUri(uri: string): ExtractPathOutput | never {
  const matches = uri.match(/\/.*\/(.*)_(\d+)x(\d+)x(\w+)\.(.*)/)
  if (matches === null) {
    throw new Error(`Invalid format uri: ${uri}`)
  }

  return {
    name: matches[1],
    width: parseInt(matches[2], 10),
    height: parseInt(matches[3], 10),
    fit: matches[4] as Fit,
    ext: matches[5],
  }
}

type ResizeAndUpdateInput = {
  objectStream: Readable
  targetKey: string,
  bucket: string,
  resizeOptions: {
    width: number
    height: number
    fit: Fit
  }
}

type Base64ImageString = string | null

export function resizeAndUpdateToS3({ targetKey, objectStream, resizeOptions, bucket }: ResizeAndUpdateInput): Promise<Base64ImageString> {
  const writeableStream = new PassThrough()

  return new Promise((resolve, reject) => {
    let base64Image: string
    const buffers: Buffer[] = []

    writeableStream.on('readable', () => {
      const buffer = writeableStream.read()
      if (buffer) {
        buffers.push(buffer)
      }
    })

    writeableStream.on('end', () => [
      base64Image = Buffer.concat(buffers).toString('base64')
    ])

    s3.upload({
      Bucket: bucket,
      Key: targetKey,
      Body: writeableStream
    }, (err) => {
      if(err) reject(err)
      resolve(base64Image)
    })

    const {fit, height, width} = resizeOptions
    const sharpPipeline = sharp()
    sharpPipeline.resize(width, height, { fit, withoutEnlargement: true })
      .toFormat('jpeg').pipe(writeableStream)

    objectStream.pipe(sharpPipeline)
  })
}