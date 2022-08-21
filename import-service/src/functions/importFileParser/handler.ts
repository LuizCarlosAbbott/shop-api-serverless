import { APIGatewayProxyHandler } from 'aws-lambda';
import { getAndParseBucketObject } from 'src/services/s3.service';
import { middyfy } from '../../libs/lambda';

const importFileParser: APIGatewayProxyHandler = async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);

  try {
    await getAndParseBucketObject(event);
    
    return {
      statusCode: 200,
      body: JSON.stringify(''),
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

export const main = middyfy(importFileParser);