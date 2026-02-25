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
        try {
          const parsed = loginSchema.safeParse(credentials)
          if (!parsed.success) {
            console.error('[auth] Invalid credentials format:', parsed.error.issues)
            return null
          }

          const { email, password } = parsed.data

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user || !user.passwordHash) {
            console.error('[auth] User not found or no password:', email.toLowerCase())
            return null
          }

          const valid = await bcrypt.compare(password, user.passwordHash)
          if (!valid) {
            console.error('[auth] Invalid password for:', email.toLowerCase())
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.displayName,
            role: user.role,
            level: user.level,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error('[auth] authorize error:', error)
          return null
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
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.level = token.level as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
  },
})
