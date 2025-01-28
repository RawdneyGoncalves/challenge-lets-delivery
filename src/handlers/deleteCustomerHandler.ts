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

    const customer = await service.getCustomer(id);
    
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    await service.deleteCustomer(id);

    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: "Customer deleted successfully" }),
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

    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};