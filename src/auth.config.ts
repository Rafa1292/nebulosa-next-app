import NextAuth, { Session, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { z } from 'zod'
import prisma from './lib/prisma'
import { getUserByEmail } from './actions'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.data = user
        }
      return token
    },
    async session({ session}) {
      if (session.user) {
        const user = await getUserByEmail(session.user.email)
        session.user.role = user !== null ? user.role : ''
        session.user.id = user !== null ? user.id : ''
      }
      return session
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          return null
        }

        const isValid = bcryptjs.compareSync(password, user.password)

        if (!isValid) {
          return null
        }

        const { password: _, ...rest } = user

        return rest
      },
    }),
  ],
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)
