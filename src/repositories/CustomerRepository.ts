import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Customer } from "../models/Customer";

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
  }

  async getById(id: string): Promise<Customer | null> {
    const result = await this.client.getItem({
      TableName: this.tableName,
      Key: { id: { S: id } },
    });

    if (!result.Item) return null;

    return new Customer(
      result.Item.id.S!,
      result.Item.name.S!,
      result.Item.birthDate.S!,
      result.Item.isActive.BOOL!,
      result.Item.addresses.SS!,
      JSON.parse(result.Item.contacts.S!)
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.client.deleteItem({
      TableName: this.tableName,
      Key: { id: { S: id } },
    });
  }
}
