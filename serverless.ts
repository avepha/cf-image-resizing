import { AWS } from '@serverless/typescript'

const serverlessConfiguration: AWS & { stepFunctions?: any } = {
  service: 'serverless-cf-image',
  frameworkVersion: '2',
  configValidationMode: 'error',
  custom: {
    dev: 'default',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      forceInclude: ['sharp'],
      packagerOptions: {
        scripts: [
          'npm rebuild sharp --target=12.20.2 --target_arch=x64 --target_platform=linux'
        ]
      }
    }
  },
  plugins: [
    'serverless-dotenv-plugin',
    'serverless-pseudo-parameters',
    'serverless-webpack',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-southeast-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['lambda:InvokeFunction'],
        Resource: [
          'arn:aws:lambda:*:*:function:originResponse'
        ]
      },
      {
        Effect: 'Allow',
        Action: ['s3:PutObject', 's3:GetObject'],
        Resource: [
          'arn:aws:s3:::demo-cf-image-resize/*'
        ]
      }
      // {
      //   Effect: 'Allow',
      //   Principal: {
      //     Service: [
      //       'lambda.amazonaws.com',
      //       'edgelambda.amazonaws.com'
      //     ]
      //   },
      //   Action: 'sts:AssumeRole'
      // }
    ]
  },
  functions: {
    originResponse: {
      name: 'originResponse',
      handler: 'src/handlers.originResponse',
      events: [
        { http: { path: '/origin-response', method: 'get' } },
        {cloudFront: {
          eventType: 'origin-response',

          }}
      ]
    }
  }
}
module.exports = serverlessConfiguration
