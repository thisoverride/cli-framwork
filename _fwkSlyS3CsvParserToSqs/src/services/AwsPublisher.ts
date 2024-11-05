import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export default class AwsPublisher {
  private sqsClient: SQSClient;

  public constructor({ region }: { region: string }) {
    this.sqsClient = new SQSClient({ region });
  }

  public async pushMessage(messageBody: string): Promise<void> {
    if (!messageBody) {
      throw new Error('MessageBody et QueueUrl sont requis pour envoyer un message à SQS');
    }

    const command = new SendMessageCommand({
      QueueUrl: process.env.QUEUE_URL as string,
      MessageBody: messageBody,
    });

    try {
      console.info('--Stack-Trace-sqs--');
      const response = await this.sqsClient.send(command);
      console.log(`--Stack-Trace-sqs-- Message sent to SQS id : ${response.MessageId}`);
    } catch (err) {
      console.log("Error sending message to SQS", err);
    }
  }
}
