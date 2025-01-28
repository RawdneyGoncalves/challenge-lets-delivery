import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Contact, Customer } from "../models/Customer";
import { ApplicationError } from "../utils/errors";

export interface ICustomerRepository {
  save(customer: Customer): Promise<void>;
  getById(id: string): Promise<Customer | null>;
  deleteById(id: string): Promise<void>;
}

export class CustomerRepository implements ICustomerRepository {
  private client: DynamoDB;
  private readonly tableName: string;

  constructor(client?: DynamoDB) {
    this.client = client || new DynamoDB({});
    this.tableName = "Customers";
  }

  async save(customer: Customer): Promise<void> {
    try {
      await this.client.putItem({
        TableName: this.tableName,
        Item: {
          id: { S: customer.id },
          name: { S: customer.name },
          birthDate: { S: customer.birthDate },
          isActive: { BOOL: customer.isActive },
          addresses: { SS: customer.addresses },
          contacts: { S: JSON.stringify(customer.contacts) },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ApplicationError(`Failed to save customer: ${error.message}`);
      }
      throw new ApplicationError('Failed to save customer: Unknown error');
    }
  }

  async getById(id: string): Promise<Customer | null> {
    try {
      const result = await this.client.getItem({
        TableName: this.tableName,
        Key: { id: { S: id } },
      });

      if (!result.Item) return null;

      const contacts = JSON.parse(result.Item.contacts.S!) as Contact[];

      return new Customer(
        result.Item.id.S!,
        result.Item.name.S!,
        result.Item.birthDate.S!,
        result.Item.isActive.BOOL!,
        result.Item.addresses.SS!,
        contacts
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new ApplicationError(`Failed to get customer: ${error.message}`);
      }
      throw new ApplicationError('Failed to get customer: Unknown error');
    }
  }

async deleteById(id: string): Promise<void> {
    try {
      await this.client.deleteItem({
        TableName: this.tableName,
        Key: { id: { S: id } },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ApplicationError(`Failed to delete customer: ${error.message}`);
      }
      throw new ApplicationError('Failed to delete customer: Unknown error');
    }
  }
}

