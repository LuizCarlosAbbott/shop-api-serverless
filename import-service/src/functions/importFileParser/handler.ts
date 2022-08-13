import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import csvParser from 'csv-parser';
import { middyfy } from '../../libs/lambda';

const BUCKET = process.env.BUCKET;

const importFileParser: APIGatewayProxyHandler = async (event) => {
  console.log(`event: ${JSON.stringify(event)}`);
  const s3 = new S3({ region: 'us-east-1' });

  try {
    await getAndParseBucketObject(event, s3);
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

const getAndParseBucketObject = async (event, s3: S3) => {
  for (const record of event.Records) {
    console.log(record);
    
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    const results = [];

    s3Stream
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('error', (error) => {
        console.log(error);
      })
      .on('end', () => {
        results.map(item => {
          console.log(`Adding item: ${JSON.stringify(item)}`);
        })
      });


    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: BUCKET + '/' + record.s3.object.key,
      Key: record.s3.object.key.replace('uploaded', 'parsed')
    }).promise();

    await s3.deleteObject({
      Bucket: BUCKET,
      Key: record.s3.object.key,
    }).promise()

    console.log(`Excel file ` + record.s3.object.key.split('/')[1] + ' has been parsed!');
  }
}