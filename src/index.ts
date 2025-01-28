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
  try {
    console.log("Iniciando criação de cliente...");
    const result = await createCustomerHandler(event, context, callback);
    if (result) {
      console.log("Cliente criado com sucesso");
      return result;
    } else {
      console.log("Erro ao criar cliente.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected error occurred in createCustomer' })
      };
    }
  } catch (error) {
    console.error("Erro no handler de criação de cliente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error occurred in createCustomer' })
    };
  }
};

export const getCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Iniciando consulta de cliente...");
    const result = await getCustomerHandler(event, context, callback);
    if (result) {
      console.log("Cliente consultado com sucesso");
      return result;
    } else {
      console.log("Erro ao consultar cliente.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected error occurred in getCustomer' })
      };
    }
  } catch (error) {
    console.error("Erro no handler de consulta de cliente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error occurred in getCustomer' })
    };
  }
};

export const updateCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Iniciando atualização de cliente...");
    const result = await updateCustomerHandler(event, context, callback);
    if (result) {
      console.log("Cliente atualizado com sucesso");
      return result;
    } else {
      console.log("Erro ao atualizar cliente.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected error occurred in updateCustomer' })
      };
    }
  } catch (error) {
    console.error("Erro no handler de atualização de cliente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error occurred in updateCustomer' })
    };
  }
};

export const deleteCustomer = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Iniciando exclusão de cliente...");
    const result = await deleteCustomerHandler(event, context, callback);
    if (result) {
      console.log("Cliente excluído com sucesso");
      return result;
    } else {
      console.log("Erro ao excluir cliente.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected error occurred in deleteCustomer' })
      };
    }
  } catch (error) {
    console.error("Erro no handler de exclusão de cliente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error occurred in deleteCustomer' })
    };
  }
};
