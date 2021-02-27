# OTA image resizing
This repository is an example of using lambda@edge to process over-the-air image resizing by intercepting image data between S3 and Cloudfront.

![Social-Media-Image-Resize-Images](https://user-images.githubusercontent.com/48562382/109389879-06de5000-7941-11eb-9c9f-f8ae395a2611.png)

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
