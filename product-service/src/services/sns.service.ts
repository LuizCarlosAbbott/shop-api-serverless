import { SNS } from "aws-sdk";

const snsClient = new SNS({ region: process.env.REGION });

export const snsPublish = async (message: string, subject: string) => {
  return await snsClient.publish({
    Subject: subject,
    Message: message,
    TopicArn: process.env.SNS_ARN,
    MessageAttributes: {
      status: {
        DataType: 'String',
        StringValue: 'success'
      }
    }
  }, () => console.log('Success email sent')).promise();
}