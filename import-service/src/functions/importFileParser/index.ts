import { handlerPath } from '../../libs/handler-resolver';

const BUCKET = process.env.BUCKET;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          { prefix: 'uploaded/' }
        ]
      }
    },
  ],
}