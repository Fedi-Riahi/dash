import connectDatabase from "@/lib/database";
import News from "@/models/News";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
        }

        await connectDatabase();
        const news = await News.findById(id);

        if (!news) {
            return NextResponse.json({ error: "News not found" }, { status: 404 });
        }

        return NextResponse.json({ news });
    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;

    try {
        const requestData = await request.json();
        await connectDatabase();

        // Find the news by ID and update its properties
        await News.findByIdAndUpdate(id, requestData);

        return NextResponse.json({ message: "News updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating news:", error);
        return NextResponse.json({ message: "Failed to update news", error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        await connectDatabase();

        // Find the news by ID and delete it
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return NextResponse.json({ message: "News not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting news:", error);
        return NextResponse.json({ message: "Failed to delete news" }, { status: 500 });
    }
}
