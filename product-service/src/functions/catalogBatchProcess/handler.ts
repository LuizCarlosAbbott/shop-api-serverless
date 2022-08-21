import { SQSBatchItemFailure, SQSEvent, SQSHandler } from 'aws-lambda';
import { AppDataSource } from 'src/data-source';
import { createBatchProductCall } from 'src/services/product.service';
import { middyfy } from '../../libs/lambda';
export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const productParameters = event.Records;
  const failedProducts: SQSBatchItemFailure[] = [];
  console.log(`Lambda: catalogBatchProcess()`);
  console.log(`Records: ${JSON.stringify(productParameters)}`);
  
  await AppDataSource.initialize()
    .then(async () => {
      for (const record of event.Records) {
        console.log(`Message Body: ${record.body}`);
        const recordBody = JSON.parse(record.body)
        
        try {
          await createBatchProductCall(recordBody);
        } catch (error) {
          console.log(error);
          failedProducts.push(recordBody.messageId);
        }
      }
    }).catch(error => {
      console.log(error);
    }).finally(() => AppDataSource.destroy());;

  if (failedProducts.length) {
    console.log(`The following items were not created successfully: ${JSON.stringify(failedProducts)}`);
  }

  return {
    batchItemFailures: failedProducts
  }
}

export const main = middyfy(catalogBatchProcess);