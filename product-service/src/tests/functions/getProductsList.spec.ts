import { Product } from "@models/Product";
import { APIGatewayProxyEventStageVariables, Context } from "aws-lambda";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import * as ProductList from '../../functions/getProductsList/handler';
import * as ProductService from '../../services/product.service';

describe('getProductsList', () => {
  const productsMock: Product[] = [{
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
  
  beforeEach(() => {
    jest.spyOn(AppDataSource, 'initialize').mockResolvedValue('' as unknown as DataSource);
    jest.spyOn(AppDataSource.manager, 'find').mockResolvedValue([]);
    jest.spyOn(AppDataSource, 'destroy').mockResolvedValue();
  })


  it('should return a success with an array of products inside the object', async () => {
    const getProductsListCallSpy = jest.spyOn(ProductService, 'getProductsListCall').mockReturnValue(Promise.resolve(productsMock));
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
    const getProductsListCallSpy = jest.spyOn(ProductService, 'getProductsListCall').mockReturnValue(Promise.reject());
    const result = await ProductList.getProductsList(eventMock,  {} as Context, () => {});
    const expected =  {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    }

    expect(getProductsListCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

