import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${env:BUCKET}',
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          { prefix: 'uploaded/' }
        ]
      }
    },
  ],
}