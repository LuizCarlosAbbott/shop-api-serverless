import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    iam: {
      role:{
        statements: [
            {
              Effect: 'Allow',
              Action: 's3:ListBucket',
              Resource: `arn:aws:s3:::${'${env:BUCKET}'}/*`
            },
            {
              Effect: 'Allow',
              Action: 's3:PutObject',
              Resource: `arn:aws:s3:::${'${env:BUCKET}'}/uploaded/*`
            },
            {
              Effect: 'Allow',
              Action: 's3:*',
              Resource: `arn:aws:s3:::${'${env:BUCKET}'}/*`
            },
            {
              Effect: 'Allow',
              Action: 'sqs:SendMessage',
              Resource: {
                'Fn::Join': [
                  ':',
                  [
                    'arn:aws:sqs',
                    '${env:REGION}',
                    '${env:ACCOUNTID}',
                    '${env:SQS}',
                  ],
                ],
              }
            }
        ]
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET: process.env.BUCKET,
      REGION: process.env.REGION,
      ACCOUNTID: process.env.ACCOUNTID,
      SQS: process.env.SQS
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
