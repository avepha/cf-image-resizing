import AWS from 'serverless/aws'

const serverlessConfiguration: AWS.Serverless = {
  service: 'serverless-cf-image',
  frameworkVersion: '2',
  configValidationMode: 'off', // err
  custom: {
    dev: 'default',
    webpack: {
      webpackConfig: './webpack.config.js',
      forceInclude: ['sharp'],
      includeModules: true
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
    ]
  },
  functions: {
    originResponse: {
      name: 'originResponse',
      handler: 'src/handlers.originResponse',
      role: 'ImageResizingRole'
    }
  },
  resources: {
    Resources: {
      ImageResizingRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          Path: '/imageresizingrole/',
          RoleName: 'image-resizing-role',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: [
                    'lambda.amazonaws.com',
                    'edgelambda.amazonaws.com'
                  ]
                },
                Action: 'sts:AssumeRole'
              }
            ]
          },
          Policies: [
            {
              PolicyName: 'myPolicyName',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: [
                      'arn:aws:lambda:*:*:function:originResponse'
                    ]
                  },
                  {
                    "Effect": "Allow",
                    "Action": [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents"
                    ],
                    "Resource": "*"
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:PutObject', 's3:GetObject'],
                    Resource: [
                      'arn:aws:s3:::demo-cf-image-resize/*'
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }

}
module.exports = serverlessConfiguration
