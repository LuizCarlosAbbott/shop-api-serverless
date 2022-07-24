import { APIGatewayProxyHandler } from 'aws-lambda';
import { getProductsListCall } from 'src/services/product.service';
import { AppDataSource } from '../../data-source';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

export const getProductsList: APIGatewayProxyHandler = async () => {
  console.log(`Lambda: getProductsList()`);

  return await AppDataSource.initialize().then(async () => {
      const products = await getProductsListCall();
      return formatJSONResponse({ products });
    }).catch(error => ({
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    }));
};

export const main = middyfy(getProductsList);