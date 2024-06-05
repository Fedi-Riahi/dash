import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { Twilio } from "twilio";

export async function POST(request) {
  const { email, status, phoneNumber } = await request.json();

  if (!email || !status || !phoneNumber) {
    return NextResponse.json(
      { message: "Email, status, and phone number are required" },
      { status: 400 }
    );
  }

  // Create a nodemailer transporter object
  var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  // Setup email data
  const mailOptions = {
    from: process.env.USER, // sender address
    to: email, // list of receivers
    subject: `Appointment Status Updated to ${status}`, // Subject line
    text: `Your appointment status has been updated to ${status}.`, // plain text body
    html: `
    <div class="max-w-lg mx-auto p-4  shadow-lg rounded-lg">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Appointment Status Update</h1>
      <p class="text-gray-700 mb-2 bg-blue-500">Your appointment status has been updated to <strong>${status}</strong>.</p>
      <div class="mt-4">
        <p class="text-gray-700">For further details, please contact us:</p>
        <ul class="list-disc list-inside">
          <li>Email: ${process.env.USER}</li>
          <li>Phone: +16075244788</li>
        </ul>
      </div>
    </div>
  `,
  };

  // Create a Twilio client
  const twilioClient = new Twilio(process.env.TWILIO_1, process.env.TWILIO_2);

  // Add country code to the phone number
  const fullPhoneNumber = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+216${phoneNumber}`;

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Send SMS
    const message = await twilioClient.messages.create({
      body: `Your appointment status has been updated to ${status}.`,
      from: "+12568011301", // Your Twilio phone number
      to: fullPhoneNumber, // The recipient's phone number with country code
    });

    return NextResponse.json(
      { message: "Email and SMS sent successfully", sid: message.sid },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { message: "Error sending notification" },
      { status: 500 }
    );
  }
}
