import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "enter email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    console.log('Received credentials:', credentials);

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        console.error('User not found for email or username:', credentials.identifier);
                        throw new Error('User not found');
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in.');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (error: any) {
                    console.log(error);
                    throw new Error(error.message);
                }
            }

        })
    ],
    callbacks: {

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username || '';
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            console.log('JWT Token:', token);
            return token;
        },
        async session({ session, token }) {
            console.log('Token Data:', token);
            if (token) {
                session.user._id = token._id?.toString();
                session.user.username = token.username || '';
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            console.log('Session Data:', session);
            return session;
        }
    },
    pages: {
        signIn: '/signIn',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
