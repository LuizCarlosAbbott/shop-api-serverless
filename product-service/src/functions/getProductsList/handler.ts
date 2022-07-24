import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { ProductEntity } from '../../entity/Product';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { convertToProductModel } from '../../utils';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await AppDataSource.initialize().then(async () => {
      const productEntityList = await getProductsListCall();
      return productEntityList.map(product => convertToProductModel(product));      
    }).catch(error => console.log(error));
    AppDataSource.destroy()

    console.log("Products: ", products);
    return formatJSONResponse({ products });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Something bad happened during your request")
    }
  }
};

export const getProductsListCall = async (): Promise<ProductEntity[]> => {
  return AppDataSource.manager.find(ProductEntity, {
    relations: { stock: true },
  })
}

export const main = middyfy(getProductsList);