import { SQS } from "aws-sdk";

const REGION = process.env.REGION;
const ACCOUNTID = process.env.ACCOUNTID;
const sqsClient = new SQS({ region: REGION });
const sqs = process.env.SQS;

export const sendMessageToSQS = (body: string) => {
  const queueURL = `https://sqs.${REGION}.amazonaws.com/${ACCOUNTID}/${sqs}`;
  console.log(queueURL)
  sqsClient.sendMessage({
    QueueUrl: queueURL,
    MessageBody: body
  }, (error, data) => {
    if (error) {
      console.log('error: ', error)
    } else {
      console.log('data:', data.MessageId);
    }
  });
}