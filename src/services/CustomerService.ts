import { CustomerFactory } from "../factories/CustomerFactory";
import { ICustomerRepository } from "../repositories/CustomerRepository";
import { Customer } from "../models/Customer";
import { validateCustomerData } from "../utils/validator";

export class CustomerService {
  constructor(private repository: ICustomerRepository) {}

  async createCustomer(data: {
    name: string;
    birthDate: string;
    isActive: boolean;
    addresses: string[];
    contacts: { email: string; phone: string; isPrimary: boolean }[];
  }): Promise<string> {
    validateCustomerData(data);

    const customer = CustomerFactory.create(
      data.name,
      data.birthDate,
      data.isActive,
      data.addresses,
      data.contacts
    );

    await this.repository.save(customer);
    return customer.id;
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.repository.getById(id);
  }

  async updateCustomer(id: string, data: {
    name?: string;
    birthDate?: string;
    isActive?: boolean;
    addresses?: string[];
    contacts?: { email: string; phone: string; isPrimary: boolean }[];
  }): Promise<Customer | null> {
    validateCustomerData(data);

    const existingCustomer = await this.repository.getById(id);
    if (!existingCustomer) {
      throw new Error("Customer not found");
    }

    if (data.name) existingCustomer.name = data.name;
    if (data.birthDate) existingCustomer.birthDate = data.birthDate;
    if (data.isActive !== undefined) existingCustomer.isActive = data.isActive;
    if (data.addresses) existingCustomer.addresses = data.addresses;
    if (data.contacts) existingCustomer.contacts = data.contacts;

    await this.repository.save(existingCustomer);
    return existingCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }

}
