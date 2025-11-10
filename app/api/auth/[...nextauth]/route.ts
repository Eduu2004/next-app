import { prisma } from "@/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {    
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder:"Email"},
                password: { label: "Password", type: "password", placeholder:"Password"},
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({ where: {email: credentials.email} })

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword!);

                return passwordMatch ? user : null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
       signIn: '/auth/signin',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Si la URL es relativa, úsala
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Si la URL pertenece al mismo sitio, úsala
            else if (new URL(url).origin === baseUrl) return url;
            // Sino, redirige a la página principal
            return baseUrl;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }