import AWS from 'aws-sdk'
import sharp from 'sharp'
import { PassThrough } from 'stream'
import { CloudFrontResponseHandler } from 'aws-lambda'
import { extractUri, getBucketFromDomainName } from './lib'

const s3 = new AWS.S3()

export const originResponse: CloudFrontResponseHandler = async (event) => {
  const requestOrigin = event.Records[0].cf.request.origin
  const requestUri = event.Records[0].cf.request.uri
  const response = event.Records[0].cf.response

  if (typeof requestOrigin.s3 === 'undefined') {
    throw new Error(`Unexpected event.Records[0].cf.request.origin=${JSON.stringify(requestOrigin)}.`)
  }

  const bucket = getBucketFromDomainName(requestOrigin.s3.domainName)
  if (!bucket) {
    throw new Error(`No bucket from ${requestOrigin.s3.domainName}`)
  }

  if (!['403', '404'].includes(response.status)) {
    console.log('cf response status != [403, 404]')
    return
  }

  // /photos/image_800x700.jpg
  const { name, width, height, ext, fit } = extractUri(requestUri)
  const originKey = `photos/${name}.${ext}`
  const tartgetKey = `photos/${name}_${width}x${height}x${fit}.${ext}`

  // console.log({ bucket, name, width, height, ext, fit, originKey, tartgetKey })
  // const outputStream = fs.createWriteStream('/Users/alfarie/Documents/GitHub/serverless-cf-image/test.jpg')

  const readableStream = await s3.getObject({ Bucket: bucket, Key: originKey }).createReadStream()
  const writeableStream = new PassThrough()

  await new Promise((resolve) => {
    s3.upload({
      Bucket: bucket,
      Key: tartgetKey,
      Body: writeableStream
    }, (err) => {
      if(err) {
        throw err
      }

      resolve(null)
    })

    const sharpPipeline = sharp()
    sharpPipeline.resize(width, height, { fit, withoutEnlargement: true })
      .toFormat('jpeg').pipe(writeableStream)

    readableStream.pipe(sharpPipeline)
  })

  return null
}
