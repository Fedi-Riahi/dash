import connectDatabase from "@/lib/database";
import Order from '@/models/Order';
import { NextResponse } from "next/server";

// Ensure that the fields match the incoming request body
export async function POST(request) {
    try {
        const {
            firstName,
            code,
            lastName,
            phone,
            email,
            userId,
            state,
            city,
            address,
            zipCode,
            items,
            totalPrice,
            status,
            cardNumber,
            paymentMethod,
            ccv,
            expiryDate,
        } = await request.json();
    
        await connectDatabase();
    
        await Order.create({
            userId,
            code,
            firstName,
            lastName,
            phone,
            email,
            items,
            totalPrice,
            state,
            city,
            address,
            zipCode,
            user: userId,
            cardNumber,
            paymentMethod,
            ccv,
            expiryDate,
            status,
        });
    
        return NextResponse.json({ message: "Order created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function GET(request) {
    try {
        await connectDatabase();
        const orders = await Order.find();
    
        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
