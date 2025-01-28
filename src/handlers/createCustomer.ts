import { APIGatewayProxyHandler } from "aws-lambda";
import { CustomerService } from "../services/CustomerService";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { ValidationError, ApplicationError } from "../utils/errors";

const service = new CustomerService(new CustomerRepository());

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    const id = await service.createCustomer({
      name: data.name,
      birthDate: data.birthDate,
      isActive: data.isActive,
      addresses: data.addresses,
      contacts: data.contacts,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Customer created", id }),
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }
    
    if (error instanceof ApplicationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};