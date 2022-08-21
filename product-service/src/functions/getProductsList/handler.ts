import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { getProductsListCall } from '../../services/product.service';

export const getProductsList: APIGatewayProxyHandler = async () => {
  console.log(`Lambda: getProductsList()`);

  try {
    const products = await getProductsListCall();
    return formatJSONResponse({ products });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Internal Server Error")
    }
  }
};

export const main = middyfy(getProductsList);