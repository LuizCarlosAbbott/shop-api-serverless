import basicAuthorizer from '@functions/basicAuthorizer';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dotenv-plugin'
  ],
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
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  functions: { basicAuthorizer },
  resources: {
    Outputs: {
			BasicAuthorizerFunctionArn: {
        Description: 'Basic authorizer ARN',
				Value: { "Fn::GetAtt": ["BasicAuthorizerLambdaFunction", "Arn"] },
				Export: {
          Name: { "Fn::Sub": "${AWS::StackName}-BasicAuthorizerArn" },
        }
			},
		},
  },
};

module.exports = serverlessConfiguration;