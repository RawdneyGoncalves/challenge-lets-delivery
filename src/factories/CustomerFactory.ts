import { Customer, Contact } from "../models/Customer";
import { v4 as uuidv4 } from "uuid";

export class CustomerFactory {
  static create(
    name: string,
    birthDate: string,
    isActive: boolean,
    addresses: string[],
    contacts: Contact[]
  ): Customer {
    return new Customer(uuidv4(), name, birthDate, isActive, addresses, contacts);
  }
}
