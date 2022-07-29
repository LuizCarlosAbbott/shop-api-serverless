import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';

const BUCKET = 'epam-shop-serverless-files';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
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
              Resource: `arn:aws:s3:::${BUCKET}/*`
            },
            {
              Effect: 'Allow',
              Action: 's3:PutObject',
              Resource: `arn:aws:s3:::${BUCKET}/uploaded/*`
            },
            {
              Effect: 'Allow',
              Action: 's3:*',
              Resource: `arn:aws:s3:::${BUCKET}/*`
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
    },
  },
  // import the function via paths
  functions: { importProductsFile },
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
