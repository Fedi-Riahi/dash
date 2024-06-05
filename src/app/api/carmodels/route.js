import connectDatabase from "@/lib/database";
import CarModel from "@/models/CarModel";
import { NextResponse } from "next/server";
export async function POST(request) {
  const {
    inStock,
    folderId,
    listingTitle,
    brand,
    model,
    condition,
    type,
    price,
    year,
    driveType,
    transmission,
    fuelType,
    maxSpeed,
    turbo,
    acceleration,
    torque,
    gears,
    powerKw,
    powerPs,
    batteryRange,
    batteryCharge,
    engineSize,
    horsePower,
    cylinders,
    color,
    doors,
    vin,
    description,
    features,
    safetyFeatures,
    cardImages,
    interiorImages,
    exteriorImages,
    coverImage,
    videos,
    audio,
    dModel,
  } = await request.json();

  await connectDatabase();

  await CarModel.create({
    inStock,
    folderId,
    listingTitle,
    brand,
    model,
    condition,
    type,
    price,
    year,
    driveType,
    transmission,
    fuelType,
    maxSpeed,
    turbo,
    acceleration,
    torque,
    gears,
    powerKw,
    powerPs,
    batteryRange,
    batteryCharge,
    engineSize,
    horsePower,
    cylinders,
    color,
    doors,
    vin,
    description,
    features,
    safetyFeatures,
    cardImages,
    interiorImages,
    exteriorImages,
    coverImage,
    videos,
    audio,
    dModel,
  });
  return NextResponse.json(
    { message: "Car Listing Created " },
    { status: 201 }
  );
}

export async function GET() {
  await connectDatabase();
  const carListing = await CarModel.find();

  return NextResponse.json({ carListing });
}
