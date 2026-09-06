import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const inputEmail = parsed.data.email.toLowerCase().trim();
        const inputPassword = parsed.data.password;

        try {
          const admin = await db.admin.findUnique({
            where: { email: inputEmail },
          });

          if (admin) {
            const isValid = await bcrypt.compare(inputPassword, admin.passwordHash);
            if (isValid) {
              return {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
              };
            }
          }
        } catch (dbError) {
          console.error('Authentication database query failed:', (dbError as Error).message);
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: unknown; id?: unknown }).role = token.role;
        (session.user as { role?: unknown; id?: unknown }).id = token.id;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});

