import { S3 } from "aws-sdk";
import csvParser from "csv-parser";

const s3 = new S3({ region: 'us-east-1' });
const BUCKET = process.env.BUCKET;

export const getAndParseBucketObject = async (event) => {
  console.log(BUCKET);
  console.log('${env:BUCKET}')
  for (const record of event.Records) {
    console.log(record);
    
    const s3Stream = s3.getObject({
      Bucket: BUCKET,
      Key: record.s3.object.key
    }).createReadStream();

    const results = [];

    await s3Stream
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

    await copyAndDeleteObject(record);   

    console.log(`Excel file ` + record.s3.object.key.split('/')[1] + ' has been parsed!');
  }
}

const copyAndDeleteObject = async (record) => {
  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: BUCKET + '/' + record.s3.object.key,
    Key: record.s3.object.key.replace('uploaded', 'parsed')
  }).promise();

  await s3.deleteObject({
    Bucket: BUCKET,
    Key: record.s3.object.key,
  }).promise()
}

export const putSignedUrl = (fileName: string): string => {
  console.log(fileName);
  const bucketParams = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
    ContentType: 'text/csv',
    Expires: 60
  }
  
  const signedUrl = s3.getSignedUrl('putObject', bucketParams);
  return signedUrl;
}