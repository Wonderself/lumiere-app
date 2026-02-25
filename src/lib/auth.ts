import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import '@/types' // Load type augmentations

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error('Invalid credentials format')
        }

        const { email, password } = parsed.data

        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })
        } catch (dbError) {
          console.error('[auth] Database error in authorize:', dbError)
          throw new Error('Database connection error')
        }

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role,
          level: user.level,
          isVerified: user.isVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.level = user.level
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || ''
        session.user.role = (token.role as string) || 'CONTRIBUTOR'
        session.user.level = (token.level as string) || 'ROOKIE'
        session.user.isVerified = (token.isVerified as boolean) ?? false
      }
      return session
    },
  },
})
