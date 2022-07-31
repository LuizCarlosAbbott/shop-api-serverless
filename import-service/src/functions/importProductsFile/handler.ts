import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const BUCKET = 'epam-shop-serverless-files';

const importProductsFile: APIGatewayProxyHandler = async (event) => {
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

const putSignedUrl = (fileName: string): string => {
  console.log(fileName);
  const s3 = new S3({ region: 'us-east-1' });
    const bucketParams = {
      Bucket: BUCKET,
      Key: `uploaded/${fileName}`,
      ContentType: 'text/csv',
      Expires: 60
  }
  
  const signedUrl = s3.getSignedUrl('putObject', bucketParams);
  return signedUrl;
}