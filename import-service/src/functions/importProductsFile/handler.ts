import { APIGatewayProxyHandler } from 'aws-lambda';
import { putSignedUrl } from 'src/services/s3.service';
import { middyfy } from '../../libs/lambda';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  const { name } = event.queryStringParameters;
  console.log(`QUERY STRING PARAMETERS -> name:${name}`);

  try {
    const signedUrl = putSignedUrl(name);
    return {
      statusCode: 200,
      body: JSON.stringify(signedUrl),
      headers: {
        "Access-Control-Allow-Origin" : "*",
      }
    } 
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    } 
  }
};

export const main = middyfy(importProductsFile);