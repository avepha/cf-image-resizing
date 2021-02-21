export function getBucketFromDomainName(domainName): string | undefined {
  const matches = /(.+)\.s3-ap-southeast-1\.amazonaws\.com/.exec(domainName)
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