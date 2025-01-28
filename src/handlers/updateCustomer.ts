import { APIGatewayProxyHandler } from "aws-lambda";
import { CustomerService } from "../services/CustomerService";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { ValidationError, NotFoundError, ApplicationError } from "../utils/errors";

const service = new CustomerService(new CustomerRepository());

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      throw new ValidationError("Customer ID is required");
    }

    const data = JSON.parse(event.body || "{}");

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
    if (error instanceof ValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof ApplicationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }

    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};