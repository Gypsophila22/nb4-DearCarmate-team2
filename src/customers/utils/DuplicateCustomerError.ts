export class DuplicateCustomerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateCustomerError';
  }
}
