import { Product } from "@models/Product";
import { APIGatewayProxyEventStageVariables, Context } from "aws-lambda";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import * as CreateProduct from "../../functions/createProduct/handler";
import * as ProductService from '../../services/product.service';

describe('createProduct', () => {
  const productMock: Product = {
    "count": 4,
    "description": "Short Product Description1",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "ProductOne"
  };
  const eventMock = (body) => ({
    body,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'post',
    isBase64Encoded: false,
    path: 'products',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: '' as unknown as APIGatewayProxyEventStageVariables,
    requestContext: undefined,
    resource: ""
  });
  const contextMock = {} as Context;
  
  beforeEach(() => {
    jest.spyOn(AppDataSource, 'initialize').mockResolvedValue('' as unknown as DataSource);
    jest.spyOn(AppDataSource.manager, 'find').mockResolvedValue([]);
    jest.spyOn(AppDataSource, 'destroy').mockResolvedValue();
  })

  it('should return a success with message: "Product successfully created"', async () => {
    const createProductCall = jest.spyOn(ProductService, 'createProductCall').mockResolvedValue();
    const result = await CreateProduct.createProduct(eventMock(productMock), contextMock, () => {});
    const expected = {
      body: JSON.stringify("Product successfully created"),
      statusCode: 200
    }

    expect(createProductCall).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should return a error with message: "Internal Server Error"', async () => {
    const createProductCall = jest.spyOn(ProductService, 'createProductCall').mockRejectedValue('');
    const result = await CreateProduct.createProduct(eventMock(productMock), contextMock, () => {});
    const expected = {
      body: JSON.stringify("Internal Server Error"),
      statusCode: 500
    }

    expect(createProductCall).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should return a error with message: "Product data is invalid"', async () => {
    const createProductCall = jest.spyOn(ProductService, 'createProductCall').mockRejectedValue("Product data is invalid");
    const result = await CreateProduct.createProduct(eventMock(productMock), contextMock, () => {});
    const expected = {
      body: JSON.stringify("Product data is invalid"),
      statusCode: 400
    }

    expect(createProductCall).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});

