import type { AWS } from '@serverless/typescript';
import 'dotenv/config';
import "reflect-metadata";

import catalogBatchProcess from './src/functions/catalogBatchProcess';
import createProduct from './src/functions/createProduct';
import getProductsById from './src/functions/getProductsById';
import getProductsList from './src/functions/getProductsList';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_HOST: process.env.DB_HOST,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-queue',
          MessageRetentionPeriod: 200,
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['CatalogItemsDeadLetterQueue', 'Arn'],
            },
            maxReceiveCount: 3,
          },
          VisibilityTimeout: 15,
        },
      },
      CatalogItemsDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-dead-letter-queue',
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    autoswagger: {
      typefiles: ['./src/models/Product.ts', './src/types/api-types.d.ts'],
      apiType: 'http'
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
