import { Customer } from "../models/Customer";

export const isValidString = (value: string | undefined): boolean => {
  return typeof value === 'string' && value.trim() !== '';
};

export const isValidDate = (value: string | undefined): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return typeof value === 'string' && regex.test(value);
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const hasPrimaryContact = (contacts: { email: string; phone: string; isPrimary: boolean }[]): boolean => {
  return contacts.some(contact => contact.isPrimary);
};

export const validateCustomerData = (data: {
  name?: string;
  birthDate?: string;
  isActive?: boolean;
  addresses?: string[];
  contacts?: { email: string; phone: string; isPrimary: boolean }[];
}): boolean => {
  if (data.name && !isValidString(data.name)) {
    throw new Error("Name is required and must be a non-empty string.");
  }

  if (data.birthDate && !isValidDate(data.birthDate)) {
    throw new Error("Birth date must be in the format YYYY-MM-DD.");
  }

  if (data.contacts && !hasPrimaryContact(data.contacts)) {
    throw new Error("At least one contact must be marked as primary.");
  }

  if (data.addresses && data.addresses.length === 0) {
    throw new Error("At least one address is required.");
  }

  if (data.contacts) {
    data.contacts.forEach(contact => {
      if (!isValidEmail(contact.email)) {
        throw new Error(`Invalid email format: ${contact.email}`);
      }
    });
  }

  return true;
};
