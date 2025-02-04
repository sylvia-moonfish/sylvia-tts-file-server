import { promises as fs } from "fs";
import path from "path";

import { User } from "@/types";

const USER_DB_PATH = path.join(
  process.cwd(),
  process.env.USER_DB_RELATIVE_PATH!
);
const PROMPT_DB_PATH = path.join(
  process.cwd(),
  process.env.PROMPT_DB_RELATIVE_PATH!
);

export async function getUser(id: string): Promise<User | null> {
  const data = await fs.readFile(USER_DB_PATH, "utf-8");
  const users = JSON.parse(data);

  return users[id];
}

export async function saveUser(user: User): Promise<void> {
  const data = await fs.readFile(USER_DB_PATH, "utf-8");
  const users = JSON.parse(data);

  users[user.id] = user;
  await fs.writeFile(USER_DB_PATH, JSON.stringify(users, null, 2));
}

export async function getPrompts(): Promise<{ [promptId: string]: string }> {
  const data = await fs.readFile(PROMPT_DB_PATH, "utf-8");
  const prompts = JSON.parse(data);

  return prompts;
}
