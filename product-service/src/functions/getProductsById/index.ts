import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}', 
        responses: {
          200: {
            description: 'successful API Response',
            bodyType: 'Product'
          },
          404: {
            description: 'Product not found'
          },
          500: {
            description: 'Internal Server Error'
          }
        }
      },
    },
  ],
};
