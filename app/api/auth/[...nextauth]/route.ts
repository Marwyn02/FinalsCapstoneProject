import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
// import { AuditLog } from "@/features/audit/api/AuditLog";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        const admin = await db.admin.findUnique({
          where: {
            username: credentials?.username.toLowerCase(),
          },
        });

        if (!admin) {
          return null;
        }

        const passwordCorrect = await compare(
          credentials?.password || "",
          admin?.password || ""
        );

        if (passwordCorrect) {
          // Update the admin's loggedIn date
          await db.admin.update({
            where: {
              adminId: admin.adminId,
            },
            data: {
              loggedIn: new Date(),
            },
          });

          const ipAddress =
            req.headers?.["x-forwarded-for"]?.toString().split(",")[0] ||
            (req as any).socket?.remoteAddress ||
            "Unknown IP";

          const uuid = uuidv4().slice(0, 13).toUpperCase();

          // const values = {
          //   username: admin.username.toString(),
          //   auditId: `audit-${uuid}`,
          //   adminId: admin.adminId.toString(),
          //   resourceType: null,
          //   resourceID: null,
          //   details: null,
          //   ipAddress,
          // };

          // await AuditLog("Login", values);

          // Any object returned will be saved in `admin` property of the JWT
          return {
            id: admin.adminId.toString(),
            adminId: admin.adminId.toString(),
            name: admin.username.toString(),
            username: admin.username.toString(),
            role: admin.role,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
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
      session.user = {
        adminId: token.adminId,
        username: token.username,
        role: token.role,
      };
      return session;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.adminId = user.adminId;
        token.username = user.username;
        token.role = user.role;
      } else {
        const dbAdmin = await db.admin.findFirst({
          where: { username: token.username },
        });

        if (dbAdmin) {
          token.adminId = dbAdmin.adminId;
          token.username = dbAdmin.username;
          token.role = dbAdmin.role;
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
