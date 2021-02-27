# OTA image resizing
This repository is an example of using lambda@edge to process over-the-air image resizing by intercepting image data between S3 and Cloudfront.

### Prerequisite
- Serverless Framework
- AWS lambda with NodeJS 12.x runtime
- AWS CloudFront configuration
- AWS S3 public readable bucket.

### Build
```
yarn build
```

### Deployment
```
yarn deploy
```