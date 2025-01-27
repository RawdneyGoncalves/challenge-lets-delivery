import { CustomerService } from "../services/CustomerService";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { CustomerFactory } from "../factories/CustomerFactory";

jest.mock("../repositories/CustomerRepository");

describe("CustomerService", () => {
  let customerService: CustomerService;
  let mockRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    customerService = new CustomerService(mockRepository);
  });

  it("should create a new customer", async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined);
    mockRepository.save = mockSave;

    const customerData = {
      name: "José da Silva",
      birthDate: "1985-04-23",
      isActive: true,
      addresses: ["Rua A, 123"],
      contacts: [{ email: "jose.silva@example.com", phone: "11987654321", isPrimary: true }],
    };

    const customerId = await customerService.createCustomer(customerData);

    expect(mockSave).toHaveBeenCalled();
    expect(customerId).toBeDefined();
  });

  it("should throw an error if data is invalid", async () => {
    const invalidData = {
      name: "", 
      birthDate: "invalid-date",
      isActive: true,
      addresses: [],
      contacts: [{ email: "invalid-email", phone: "11987654321", isPrimary: true }],
    };

    await expect(customerService.createCustomer(invalidData))
      .rejects
      .toThrowError("Name is required and must be a non-empty string.");
  });

  it("should update an existing customer", async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockGetById = jest.fn().mockResolvedValue({
      id: "123",
      name: "José da Silva",
      birthDate: "1985-04-23",
      isActive: true,
      addresses: ["Rua A, 123"],
      contacts: [{ email: "jose.silva@example.com", phone: "11987654321", isPrimary: true }],
    });

    mockRepository.save = mockSave;
    mockRepository.getById = mockGetById;

    const updatedData = {
      name: "José Santos",
      birthDate: "1986-06-15",
    };

    const updatedCustomer = await customerService.updateCustomer("123", updatedData);

    expect(mockGetById).toHaveBeenCalledWith("123");
    expect(mockSave).toHaveBeenCalled();
    expect(updatedCustomer?.name).toBe("José Santos");
    expect(updatedCustomer?.birthDate).toBe("1986-06-15");
  });
});
