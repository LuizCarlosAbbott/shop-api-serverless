import { Product } from '@models/Product';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { middyfy } from '../../libs/lambda';
import { createProductCall } from '../../services/product.service';

export const createProduct: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const productParameters = event.body;
  console.log(`Lambda: createProduct()`);
  console.log(`BODY: ${JSON.stringify(productParameters)}`);

  return await AppDataSource.initialize()
    .then(async () => {
      await createProductCall(productParameters as unknown as Product);
      return {
        statusCode: 200,
        body: JSON.stringify("Product successfully created")
      };
    }).catch(error => {
      console.log(error);
      if(error === "Product data is invalid") {
        return {
          statusCode: 400,
          body: JSON.stringify("Product data is invalid")
        }
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify("Internal Server Error")
        }
      }
    }).finally(() => AppDataSource.destroy());;
}

export const main = middyfy(createProduct);