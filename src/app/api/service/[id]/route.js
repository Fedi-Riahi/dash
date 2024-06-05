// Importing necessary modules and models
import connectDatabase from "@/lib/database";
import Service from '@/models/Service';
import { NextResponse } from "next/server";

// GET by ID endpoint for fetching a single service
export async function GET(request, { params }) {
    try {
        const { id } = params;
        await connectDatabase();
        const service = await Service.findById(id);
    
        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }
    
        return NextResponse.json({ service });
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT endpoint for updating a service
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { categoryName, services } = await request.json();
        await connectDatabase();
        
        const updatedService = await Service.findByIdAndUpdate(id, {
            categoryName,
            services
        }, { new: true });

        if (!updatedService) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Service updated successfully", service: updatedService }, { status: 200 });
    } catch (error) {
        console.error("Error updating service:", error);
        return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
    }
}

// DELETE endpoint for deleting a service
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await connectDatabase();
        
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting service:", error);
        return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
    }
}