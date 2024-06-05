import connectDatabase from "@/lib/database";
import Appointment from "@/models/Appointment";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      carVIN,
      services,
      selectedDate,
      selectedTime,
      mobilityOption,
      status,
    } = await request.json();

    await connectDatabase();

    await Appointment.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      carVIN,
      services,
      selectedDate,
      selectedTime,
      mobilityOption,
      status,
    });

    return NextResponse.json(
      { message: "Appointment created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDatabase();
    const appointments = await Appointment.find();
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
