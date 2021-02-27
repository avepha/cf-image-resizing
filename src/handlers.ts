import s3 from './s3'
import { CloudFrontResponseResult } from 'aws-lambda'
import { extractUri, getBucketFromDomainName, resizeAndUpdateToS3 } from './lib'
import pkg from '../package.json'

export const originResponse = async (event): Promise<CloudFrontResponseResult> => {
  console.log(pkg.version)
  console.log(JSON.stringify(event, null, 2))
  const requestOrigin = event.Records[0].cf.request.origin
  const requestUri = event.Records[0].cf.request.uri
  const response = event.Records[0].cf.response

  if (typeof requestOrigin.s3 === 'undefined') {
    console.log(`Unexpected event.Records[0].cf.request.origin=${JSON.stringify(requestOrigin)}.`)
    return response
  }

  const bucket = getBucketFromDomainName(requestOrigin.s3.domainName)
  if (!bucket) {
    console.log(`No bucket from ${requestOrigin.s3.domainName}`)
    return response
  }

  if (!['403', '404'].includes(response.status)) {
    console.log('cf response status != [403, 404]')

    return response
  }

  // /photos/image_800x700.jpg
  const { name, width, height, ext, fit } = extractUri(requestUri)
  const originKey = `photos/${name}.${ext}`
  const targetKey = `photos/${name}_${width}x${height}x${fit}.${ext}`

  const objectStream = await s3.getObject({ Bucket: bucket, Key: originKey }).createReadStream()

  const base64Image = await resizeAndUpdateToS3({
    objectStream,
    targetKey,
    bucket,
    resizeOptions: {
      fit,
      width,
      height
    }
  })

  console.log(base64Image)

  response.status = '200'
  response.body = base64Image
  response.bodyEncoding = 'base64'
  response.headers = response.headers || {}
  response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/jpeg' }]

  return response
}
