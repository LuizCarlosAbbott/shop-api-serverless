import { APIGatewayProxyEventStageVariables, Context } from "aws-lambda";
import * as ProductList from "../functions/getProductsList/handler";

describe('getProductsList', () => {
  const productsMock = [{
    "count": 4,
    "description": "Short Product Description1",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "ProductOne"
  }];
  const eventMock = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'get',
    isBase64Encoded: false,
    path: 'products',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: '' as unknown as APIGatewayProxyEventStageVariables,
    requestContext: undefined,
    resource: ""
  };

  it('should return a success with an array of products inside the object', async () => {
    const getProductsListCallSpy = jest.spyOn(ProductList, 'getProductsListCall').mockReturnValue(Promise.resolve(productsMock));
    const result = await ProductList.getProductsList(eventMock,  {} as Context, () => {});
    const expected = { 
      body: JSON.stringify({ products: productsMock }), 
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200
    }

    expect(getProductsListCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should fail returning a statusCode of 500 and a message of error', async () => {
    const getProductsListCallSpy = jest.spyOn(ProductList, 'getProductsListCall').mockReturnValue(Promise.reject());
    const result = await ProductList.getProductsList(eventMock,  {} as Context, () => {});
    const expected =  {
      statusCode: 500,
      body: JSON.stringify("Something bad happened during your request")
    }

    expect(getProductsListCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

