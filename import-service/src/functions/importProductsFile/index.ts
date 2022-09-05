import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        authorizer: {
          name: 'basicAuthorizer',
          arn: {
            "Fn::ImportValue": "authorization-service-dev-BasicAuthorizerArn",
          },
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      }
    },
  ],
};
