export default class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationException';
  }
}


