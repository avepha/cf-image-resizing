import {AWS} from '@serverless/typescript'

const serverlessConfiguration: AWS & { stepFunctions?: any } = {
  service: 'serverless-cf-image',
  frameworkVersion: '2',
  configValidationMode: "error",
  custom: {
    dev: 'default',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  plugins: [
    'serverless-dotenv-plugin',
    'serverless-pseudo-parameters',
    'serverless-webpack',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'ap-southeast-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['lambda:InvokeFunction'],
        Resource: [
          'arn:aws:lambda:*:*:function:originResponse',
        ],
      },
    ]
  },
  functions: {
    originResponse: {
      name: 'originResponse',
      handler: 'src/handlers.originResponse',
      events: [{http: {path: '/origin-response', method: 'get'}}],
    },
  },
}
module.exports = serverlessConfiguration
