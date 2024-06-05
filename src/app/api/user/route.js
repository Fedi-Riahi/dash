// api/user.js
import connectDatabase from "@/lib/database";
import User from '@/models/User';
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password, role } = await request.json();

    try {
        await connectDatabase();
        
        // Check if user already exists with the provided email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Create new user if not already exists
        await User.create({ email, password, role });
        return NextResponse.json({ message: "User registered" }, { status: 201 });
    } catch (error) {
        console.error("Error saving user email:", error);
        return NextResponse.error("Failed to save user email", 500);
    }
}


export async function GET() {
    await connectDatabase();
    const users = await User.find();
    return NextResponse.json({ users });
}
