import { JSONFilePreset } from "lowdb/node";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  useCase: string | null;
  surveyComplete: boolean;
  createdAt: string;
}

interface DBSchema {
  users: User[];
}

const defaultData: DBSchema = { users: [] };

export const db = await JSONFilePreset<DBSchema>("data/db.json", defaultData);

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await db.read();
  return db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  await db.read();
  return db.data.users.find((u) => u.id === id);
}

export async function createUser(user: User): Promise<void> {
  db.data.users.push(user);
  await db.write();
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User | null> {
  await db.read();
  const idx = db.data.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.data.users[idx] = { ...db.data.users[idx], ...patch };
  await db.write();
  return db.data.users[idx];
}
