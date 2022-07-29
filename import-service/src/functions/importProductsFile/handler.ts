import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const importProductsFile: APIGatewayProxyHandler = async (event) => {
  try {
    const signedUrl = putSignedUrl();
    return formatJSONResponse({
      message: signedUrl,
      event,
    });  
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      message: `Hello, welcome to the exciting Serverless world!`,
      event,
    });
  }
};

export const main = middyfy(importProductsFile);

const putSignedUrl = (fileName = 'fileName'): string => {
  const s3 = new S3({ region: 'us-east-1' });
    const bucketParams = {
      Bucket: 'epam-shop-serverless-files',
      Key: fileName
  }
  
  const signedUrl = s3.getSignedUrl('putObject', bucketParams);
  return signedUrl;
}