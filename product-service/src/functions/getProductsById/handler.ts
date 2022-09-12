import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { getProductCall } from '../../services/product.service';

export const getProductsById: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  const { productId } = event.pathParameters;
  console.log(`PATH PARAMETERS -> productId:${productId}`);

  try {
    const product = await getProductCall(productId);
    return formatJSONResponse({ product });
  } catch (error) {
    console.log(error);
    if (error === "Product not found") {
      return {
        statusCode: 404,
        body: JSON.stringify("Product not found")
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify("Internal Server Error")
      }
    }
  }
};



export const main = middyfy(getProductsById);
