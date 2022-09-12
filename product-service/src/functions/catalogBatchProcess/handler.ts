import { Product } from '@models/Product';
import { SQSBatchItemFailure, SQSEvent, SQSHandler } from 'aws-lambda';
import { AppDataSource } from 'src/data-source';
import { createBatchProductCall } from 'src/services/product.service';
import { snsPublish } from 'src/services/sns.service';
import { middyfy } from '../../libs/lambda';
export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const productParameters = event.Records;
  const batchItemFailures: SQSBatchItemFailure[] = [];
  const successfulProducts: Product[] = [];
  console.log(`Lambda: catalogBatchProcess()`);
  console.log(`Records: ${JSON.stringify(productParameters)}`);
  
  return await AppDataSource.initialize()
    .then(async () => {
      for (const record of event.Records) {
        console.log(`Message Body: ${record.body}`);
        const recordBody = JSON.parse(record.body)
        
        try {
          const product = await createBatchProductCall(recordBody);
          successfulProducts.push(product);
        } catch (error) {
          console.log(error);
          batchItemFailures.push({ itemIdentifier: record.messageId });
        }
      }
    }).catch(error => {
      console.log(error);
    }).finally(async () => {
      AppDataSource.destroy();

      if (successfulProducts.length) {
        const message = JSON.stringify(successfulProducts);
        console.log(`The following items were created successfully: ${message}`);
        await snsPublish(message, 'Successful Products Creation');
      }

      return {
        batchItemFailures
      }
    });;
}

export const main = middyfy(catalogBatchProcess);