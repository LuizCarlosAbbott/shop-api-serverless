import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        bodyType: 'helloPostBody'
      },
      responses: {
        200: {
          description: 'Product successfully created'
        },
        400: {
          description: 'Product data is invalid'
        },
        500: {
          description: 'Internal Server Error'
        }
      }
    },
  ],
};
