import { Product } from "@models/Product";
import { APIGatewayProxyEventStageVariables, Context } from "aws-lambda";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import * as ProductListById from "../../functions/getProductsById/handler";
import * as ProductService from '../../services/product.service';

describe('getProductsById', () => {
  const productMock: Product = {
    "count": 4,
    "description": "Short Product Description1",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "ProductOne"
  };
  const eventMock = (pathParameters) => ({
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'get',
    isBase64Encoded: false,
    path: 'products',
    pathParameters,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: '' as unknown as APIGatewayProxyEventStageVariables,
    requestContext: undefined,
    resource: ""
  });
  const contextMock = {} as Context;
  
  beforeEach(() => {
    jest.spyOn(AppDataSource, 'initialize').mockResolvedValue('' as unknown as DataSource);
    jest.spyOn(AppDataSource, 'destroy').mockResolvedValue();
  })

  it('should return a success with an array of products inside the object', async () => {
    const getProductCallSpy = jest.spyOn(ProductService, 'getProductCall').mockReturnValue(Promise.resolve(productMock));
    const result = await ProductListById.getProductsById(eventMock("7567ec4b-b10c-48c5-9345-fc73c48a80aa"), contextMock, () => {});
    const expected = {
      body: JSON.stringify({ product: productMock }),
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200
    }

    expect(getProductCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should fail and return Product not found', async () => {
    const getProductCallSpy = jest.spyOn(ProductService, 'getProductCall').mockReturnValue(Promise.reject("Product not found"));
    const result = await ProductListById.getProductsById(eventMock("nonexistent"), contextMock, () => {});
    const expected = {
      statusCode: 404,
      body: JSON.stringify("Product not found")
    }

    expect(getProductCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should fail and return Something bad happened during your request', async () => {
    const getProductCallSpy = jest.spyOn(ProductService, 'getProductCall').mockReturnValue(Promise.reject("Something bad happened during your request"));
    const result = await ProductListById.getProductsById(eventMock("nonexistent"), contextMock, () => {});
    const expected = {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    }

    expect(getProductCallSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

