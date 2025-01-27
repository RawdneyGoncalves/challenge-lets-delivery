import { APIGatewayProxyHandler } from "aws-lambda";
import { CustomerService } from "../services/CustomerService";
import { CustomerRepository } from "../repositories/CustomerRepository";

const service = new CustomerService(new CustomerRepository());

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Customer ID is required" }),
      };
    }

    const data = JSON.parse(event.body || "{}");

    const customer = await service.getCustomer(id);
    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Customer not found" }),
      };
    }

    const updatedCustomer = await service.updateCustomer(id, {
      name: data.name,
      birthDate: data.birthDate,
      isActive: data.isActive,
      addresses: data.addresses,
      contacts: data.contacts,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Customer updated", customer: updatedCustomer }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
