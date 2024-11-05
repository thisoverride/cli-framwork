import S3EventService from './services/AwsS3EventService'

export const handler = async(event: any): Promise<void> => {
  console.log(event)
  await S3EventService.processS3CsvEvent(event);
};
