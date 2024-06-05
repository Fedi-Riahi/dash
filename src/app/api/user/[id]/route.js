import connectDatabase from "@/lib/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is missing" },
        { status: 400 }
      );
    }

    await connectDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching User :", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const requestData = await request.json();
    const { firstName, lastName, email, phone, state, city, zipCode, address } =
      requestData;

    await connectDatabase();

    // Find the car part by ID and update all its properties
    await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      email,
      phone,
      state,
      city,
      zipCode,
      address,
    });

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating User:", error);
    return NextResponse.json(
      { message: "Failed to update User", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDatabase();

    // Find the car part by ID and delete it
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting User:", error);
    return NextResponse.json(
      { message: "Failed to delete User" },
      { status: 500 }
    );
  }
}
