import { Product } from '@models/Product';
import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { createProductCall } from 'src/services/product.service';
import { AppDataSource } from '../../data-source';
import { middyfy } from '../../libs/lambda';

export const createProduct: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  console.log(event.body)
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
    }).catch(error => ({
        statusCode: 500,
        body: JSON.stringify("Internal Server Error")
      })
    );
}

export const main = middyfy(createProduct);