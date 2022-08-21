import { SQSBatchItemFailure, SQSEvent, SQSHandler } from 'aws-lambda';
import { createProductCall } from 'src/services/product.service';
import { middyfy } from '../../libs/lambda';
export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const productParameters = event.Records;
  const failedProducts: SQSBatchItemFailure[] = [];
  console.log(`Lambda: catalogBatchProcess()`);
  console.log(`Records: ${JSON.stringify(productParameters)}`);

  await Promise.all(
    event.Records.map(async (record) => {
      console.log(`Message Body: ${record.body}`);
      const recordBody = JSON.parse(record.body)
      
      try {
        await createProductCall(recordBody);
      } catch (error) {
        console.log(error);
        failedProducts.push(recordBody.messageId);
      }
    })
  );

  if (failedProducts.length) {
    console.log(`The following items were not created successfully: ${JSON.stringify(failedProducts)}`);
  }

  return {
    batchItemFailures: failedProducts
  }
}

export const main = middyfy(catalogBatchProcess);