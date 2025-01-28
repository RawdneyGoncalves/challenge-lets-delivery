export class ApplicationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApplicationError';
    }
  }
  
  export class ValidationError extends ApplicationError {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  export class NotFoundError extends ApplicationError {
    constructor(message: string) {
      super(message);
      this.name = 'NotFoundError';
    }
  }