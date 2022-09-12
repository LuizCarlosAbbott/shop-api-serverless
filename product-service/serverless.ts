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
      REGION: process.env.REGION,
      SQS: process.env.SQS,
      SQS_DLQ: process.env.SQS_DLQ,
      SNS_EMAIL: process.env.SNS_EMAIL,
      SNS_ARN: process.env.SNS_ARN
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: [{ Ref: 'createBatchProductTopic' }],
      },
    ]
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${env:SQS}',
          MessageRetentionPeriod: 200,
          ReceiveMessageWaitTimeSeconds: 20,
          RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['CatalogItemsDeadLetterQueue', 'Arn'] },
            maxReceiveCount: 5,
          }
        },
      },
      CatalogItemsDeadLetterQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${env:SQS_DLQ}',
        },
      },
      createBatchProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createBatchProductTopic',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:SNS_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createBatchProductTopic',
          },
          FilterPolicy: {
            status: ["success"]
          }
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
