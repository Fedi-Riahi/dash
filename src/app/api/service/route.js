// Importing necessary modules and models
import connectDatabase from "@/lib/database";
import Service from '@/models/Service';
import { NextResponse } from "next/server";

// POST endpoint for creating services
export async function POST(request) {
    try {
        // Destructuring data from the request body
        const { categoryName, services } = await request.json();
        
        // Connecting to the database
        await connectDatabase();
        
        // Creating service document with category name and services array
        const createdService = await Service.create({
            categoryName,
            services
        });

        // Returning success response
        return NextResponse.json({ message: "Services created successfully", service: createdService }, { status: 201 });
    } catch (error) {
        // Handling errors if any occur during the process
        console.error("Error creating services:", error);
        return NextResponse.json({ error: "Failed to create services" }, { status: 500 });
    }
}


export async function GET(request) {
    try {
      await connectDatabase();
      const services = await Service.find();
  
      return NextResponse.json({ services });
    } catch (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
