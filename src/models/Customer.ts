export type Contact = {
    email: string;
    phone: string;
    isPrimary: boolean;
  };
  
  export class Customer {
    constructor(
      public readonly id: string,
      public name: string,
      public birthDate: string,
      public isActive: boolean,
      public addresses: string[],
      public contacts: Contact[]
    ) {
      this.validate();
    }
  
    private validate() {
      if (!this.contacts.some((contact) => contact.isPrimary)) {
        throw new Error("At least one contact must be marked as primary.");
      }
    }
  
    toggleActiveStatus(): void {
      this.isActive = !this.isActive;
    }
  }
  