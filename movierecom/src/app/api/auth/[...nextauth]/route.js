import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              provider: 'credentials' 
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Login failed");
          }

          const user = await res.json(); 

          if (user && user.is_Auth) {
            console.log("Login successful via credentials");
            return user;
          }

          return null;
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "github") {
        try {
          const providerUser = {
            name: profile.name || user.name,
            email: profile.email || user.email,
            image: user.image,
            provider: account.provider,
            created_at: new Date(),
          };

          const existingUser = await axios.get(
            `http://localhost:5000/signup?user_email=${providerUser.email}`
          );

          if (!existingUser.data.user) {
            await axios.post("http://localhost:5000/signup", providerUser);
          } else {
            await axios.post("http://localhost:5000/login", providerUser);
          }
        } catch (error) {
          console.error("Error checking/adding user to the database", error);
          return false;
        }
      }

      return true; 
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/user`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
