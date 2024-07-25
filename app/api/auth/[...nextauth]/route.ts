import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { compare } from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          console.log("Credentials received:", credentials);

          // Add logic here to look up the user from the credentials supplied
          const user = await db.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

          console.log("User found:", user);

          if (!user) {
            console.log("No user found.");
            return null;
          }

          const passwordCorrect = await compare(
            credentials?.password || "",
            user?.password || ""
          );

          console.log({ passwordCorrect });

          if (passwordCorrect) {
            console.log("Youre logged in: ", user);

            // Any object returned will be saved in `user` property of the JWT
            return {
              ...user,
              id: user?.id.toString(), // Convert the ID to a string
            };
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as SessionStrategy,
  },

  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },

    async jwt({ token, user }: any) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
