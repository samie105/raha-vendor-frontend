"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { mockDB } from "../db/mock-db";
import { UserCreateSchema } from "@/lib/schemas";

const SESSION_COOKIE = "mock-session";

export async function signUpVendor(email: string, password: string) {
  const validation = UserCreateSchema.safeParse({ email, password });

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Check if user exists
  const existingUser = await mockDB.getUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists" };
  }

  // Create user
  const user = await mockDB.createUser({ email, password, role: "vendor" });

  // Create session
  const token = await mockDB.createSession(user.id, user.email, user.role);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { data: { user } };
}

export async function signUpAdmin(email: string, password: string) {
  const validation = UserCreateSchema.safeParse({ email, password });

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Check if user exists
  const existingUser = await mockDB.getUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists" };
  }

  // Create admin user
  const user = await mockDB.createUser({ email, password, role: "admin" });

  // Create session
  const token = await mockDB.createSession(user.id, user.email, user.role);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { data: { user } };
}

export async function signIn(email: string, password: string) {
  // In a real app, you'd validate the password here
  // For now, we just check if user exists
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = password; // Acknowledge password param for future use
  const user = await mockDB.getUserByEmail(email);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  // Create session
  const token = await mockDB.createSession(user.id, user.email, user.role);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { data: { user } };
}

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await mockDB.deleteSession(token);
  }
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await mockDB.getSession(token);
  if (!session) return null;

  const user = await mockDB.getUserById(session.userId);
  return user;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await mockDB.getSession(token);
  if (!session) return null;

  return {
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  };
}
