# OTA image resizing

### Build
```
yarn build
```

### Deployment
```
docker run --privileged=true -it --rm -v "$PWD/build":/app -v ~/.aws/credentials:/root/.aws/credentials -w /app lambda-ci serverless deploy --stage dev --region us-east-1
```