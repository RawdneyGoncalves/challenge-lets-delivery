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

    const customer = await service.getCustomer(id);

    if (!customer) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Customer not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
