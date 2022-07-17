import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';

const getProductsList: APIGatewayProxyHandler = async (event) => {
  return formatJSONResponse({
    message: `Hello, welcome to the exciting Serverless world! getProductsList`,
    event,
  });
};

export const main = middyfy(getProductsList);
