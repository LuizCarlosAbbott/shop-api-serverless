import { SQSEvent, SQSHandler } from 'aws-lambda';
import { AppDataSource } from '../../data-source';
import { middyfy } from '../../libs/lambda';
export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  const productParameters = event.Records;
  console.log(`Lambda: catalogBatchProcess()`);
  console.log(`Records: ${JSON.stringify(productParameters)}`);

  return await AppDataSource.initialize()
    .then(async () => {
      event.Records.map(async (record) => {
        console.log(record);
        console.log('body: ' + JSON.parse(record.body))
      });
    }).catch(error => {
      console.log(error);

    }).finally(() => AppDataSource.destroy());;
}

export const main = middyfy(catalogBatchProcess);