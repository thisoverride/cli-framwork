import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import AwsPublisher from './AwsPublisher';

export default class S3EventService {

  public static async processS3CsvEvent(event: any): Promise<void> {
    try {
      const client = new S3Client({ region: 'eu-west-1' });
      const bucket: string = event.detail.bucket.name;
      const key: string = event.detail.object.key;

      const { Body } = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const csvData: string = Body ? await Body.transformToString() : '';

      if (!csvData) {
        throw new Error('Le fichier CSV est vide ou introuvable.');
      }

      const lines: string[] = csvData.split('\n');
      if (lines.length === 0) {
        throw new Error('Le fichier CSV ne contient aucune donnée.');
      }

      const headers: string[] = lines[0].split(';');
      const publisher = new AwsPublisher({ region: 'eu-west-1' });

      for (const line of lines.slice(1)) {
        const values = line.split(';');
        const csvObj: Record<string, string> = {};

        headers.forEach((header, i) => csvObj[header] = values[i] || '');
        await publisher.pushMessage(JSON.stringify(csvObj));  
      }
    } catch (error) {
      console.error('Une erreur est survenue lors du traitement de l\'événement S3:', error);
      throw error; 
    }
  }
}
