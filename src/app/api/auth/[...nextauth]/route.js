import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDatabase from "@/lib/database";
import User from "@/models/User";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectDatabase(); // Connect to database
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user, account, profile) {
      console.log("Sign-in callback triggered:", { user });

      // Check if the account provider is Google and profile email exists
      if (account?.provider === "google" && profile?.email) {
        try {
          await connectDatabase(); // Connect to database
          console.log("Database connected");

          // Debug: Check profile email
          console.log("Profile email:", profile.email);

          // Save user's email to the database
          const newUser = new User({ email: profile.email });
          await newUser.save();
          console.log("User email saved:", profile.email);

          // Inside the signIn callback of authOptions
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profile.email }),
          });

          if (!response.ok) {
            throw new Error("Failed to save user email");
          }

          console.log("User email saved in api/user");
        } catch (error) {
          console.error("Error saving user email:", error);
        }
      }
      return true; // Continue sign in
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
