import bcrypt from 'bcryptjs';

// Mock user database - in-memory storage
interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

// Pre-hashed passwords (bcrypt hash of the actual passwords)
// admin123 hash
// buyer123 hash
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2b$10$6Q72wvSMB2Ds9shR5c022OzNpc5rSzpmBkS1mJ0WnKDCCpOnEr/cq', // admin123
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    email: 'alice@email.com',
    password: '$2b$10$.qV2B9pcC/JsAWIWJNTx9OzliAKCEMQXlHV2EW5I/LTQDo3YabdX6', // buyer123
    name: 'Alice Buyer',
    role: 'buyer',
  },
];

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = mockUsers.find(u => u.email === email);
  return user || null;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function createUser(email: string, password: string, name: string, role: string = 'admin'): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: mockUsers.length + 1,
    email,
    password: hashedPassword,
    name,
    role,
  };
  mockUsers.push(newUser);
  return newUser;
}
