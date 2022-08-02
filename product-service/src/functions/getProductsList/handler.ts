import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { getProductsListCall } from '../../services/product.service';

export const getProductsList: APIGatewayProxyHandler = async () => {
  console.log(`Lambda: getProductsList()`);

  return await AppDataSource.initialize().then(async () => {
      const products = await getProductsListCall();
      return formatJSONResponse({ products });
    }).catch(error => {
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify("Internal Server Error")
      }
  }).finally(() => AppDataSource.destroy());
};

export const main = middyfy(getProductsList);