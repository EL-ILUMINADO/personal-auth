'use server';

import { redirect } from 'next/navigation';
import { db } from '../lib/db';
import { createSession, deleteSession } from '../lib/session';
import bcrypt from 'bcrypt';

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || typeof email !== 'string') {
    return { error: 'Invalid email provided.' };
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?!.*\s).{8,}$/;

  if (
    !password ||
    typeof password !== 'string' ||
    !passwordRegex.test(password)
  ) {
    return {
      error:
        'Password must be at least 8 characters long, contain an uppercase letter, a symbol, and have no spaces.',
    };
  }

  let userId: string;

  try {
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: 'A user with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
      },
    });

    userId = user.id;
  } catch {
    return { error: 'Something went wrong on our end. Please try again.' };
  }

  try {
    await createSession(userId);
  } catch {
    return {
      error: 'Account created but failed to start session. Please try again.',
    };
  }

  redirect('/welcome');
}

export async function logoutUser() {
  await deleteSession();
  redirect('/');
}
