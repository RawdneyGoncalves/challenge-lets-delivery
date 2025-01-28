import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { CustomerService } from './services/CustomerService';
import { CustomerRepository } from './repositories/CustomerRepository';
import { handler as createCustomerHandler } from './handlers/createCustomerHandler';
import { handler as getCustomerHandler } from './handlers/getCustomerHandler';
import { handler as updateCustomerHandler } from './handlers/updateCustomerHandler';
import { handler as deleteCustomerHandler } from './handlers/deleteCustomerHandler';
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDB();
const customerRepository = new CustomerRepository(dynamoClient);
const customerService = new CustomerService(customerRepository);

export const createCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  const result = await createCustomerHandler(event, context, callback);
  return result ?? {
    statusCode: 500,
    body: JSON.stringify({ error: 'Unexpected error occurred in createCustomer' })
  };
};

export const getCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  const result = await getCustomerHandler(event, context, callback);
  return result ?? {
    statusCode: 500,
    body: JSON.stringify({ error: 'Unexpected error occurred in getCustomer' })
  };
};

export const updateCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  const result = await updateCustomerHandler(event, context, callback);
  return result ?? {
    statusCode: 500,
    body: JSON.stringify({ error: 'Unexpected error occurred in updateCustomer' })
  };
};

export const deleteCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  const result = await deleteCustomerHandler(event, context, callback);
  return result ?? {
    statusCode: 500,
    body: JSON.stringify({ error: 'Unexpected error occurred in deleteCustomer' })
  };
};
