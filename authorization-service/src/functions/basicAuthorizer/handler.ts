import { middyfy } from '@libs/lambda';
import { APIGatewayAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (principalId: string, Effect = 'Deny', Resource: string) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect,
        Resource,
      },
    ],
  },
});

const basicAuthorizer = async (event: APIGatewayAuthorizerEvent) => {
	console.log(event);

  if (event.type !== 'TOKEN') {
		throw new Error('Error: token value is missing');
	}

	const { authorizationToken = '', methodArn } = event;

	const authorizationTokenValue = authorizationToken.split('Basic ')[1];

	if (!authorizationTokenValue) {
		return {
      statusCode: 401,
      body: JSON.stringify('Authorization header was not provided')
    }
	}

	if (authorizationTokenValue !== process.env.AUTHORIZATION_TOKEN) {
		return generatePolicy(authorizationTokenValue, 'Deny', methodArn);
	}
	console.log('Allow');
	return generatePolicy(authorizationTokenValue, 'Allow', methodArn);
}

export const main = middyfy(basicAuthorizer);