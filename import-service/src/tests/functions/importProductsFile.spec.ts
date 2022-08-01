import { APIGatewayProxyEventStageVariables, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as ImportProductsFileService from '../../functions/importProductsFile/handler';

describe('importProductsFile', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  })

  const eventMock = (queryStringParameters) => ({
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: 'get',
    isBase64Encoded: false,
    path: 'import',
    pathParameters: null,
    queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables: '' as unknown as APIGatewayProxyEventStageVariables,
    requestContext: undefined,
    resource: ""
  });
  const contextMock = {} as Context;

  it('should return success with statusCode 200 and a url as response', async () => {
    const presignedUrlMock = 'http://presignedurl';
    const putSignedUrlSpy = jest.spyOn(ImportProductsFileService, 'putSignedUrl').mockReturnValue(presignedUrlMock);
    const queryStringParametersMock = { name: 'test.csv' };
    const result = await ImportProductsFileService.importProductsFile(eventMock(queryStringParametersMock), contextMock, () => {});
    const expected = {
      statusCode: 200,
      body: JSON.stringify(presignedUrlMock),
      headers: {
        "Access-Control-Allow-Origin" : "*",
      }
    }

    expect(putSignedUrlSpy).toHaveBeenCalledWith(queryStringParametersMock.name);
    expect(result).toEqual(expected);
  });

  it('should return a statusCode 500 with "Internal Server Error" message', async () => {
    jest.spyOn(ImportProductsFileService, 'putSignedUrl').mockImplementation(() => { throw new Error('error') });
    const queryStringParametersMock = { name: 'test.csv' };
    const result = await ImportProductsFileService.importProductsFile(eventMock(queryStringParametersMock), contextMock, () => {});
    const expected = {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    } 

    expect(result).toEqual(expected);
  });
  
  it('putSignedUrl() -> should return a presignedUrl', () => {
    const presignedUrlMock = 'presignedurlmock';
    jest.spyOn(S3.prototype, 'getSignedUrl').mockImplementation(() => presignedUrlMock);
    const fileNameMock = 'test.csv';
    const result = ImportProductsFileService.putSignedUrl(fileNameMock);
    
    expect(result).toEqual(presignedUrlMock);
  });
});

