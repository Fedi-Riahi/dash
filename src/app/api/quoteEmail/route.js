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

  // Ensure phoneNumber is a string
  const phoneStr = String(phoneNumber);

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
    subject: `Quote Status Updated to ${status}`, // Subject line
    text: `Your Quote status has been updated to ${status}.`, // plain text body
    html: `<p>Your Quote status has been updated to <strong>${status}</strong>.</p>`, // html body
  };

  // Create a Twilio client
  const twilioClient = new Twilio(process.env.TWILIO_1, process.env.TWILIO_2);

  // Add country code to the phone number
  const fullPhoneNumber = phoneStr.startsWith('+') ? phoneStr : `+216${phoneStr}`;

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Send SMS
    const message = await twilioClient.messages.create({
      body: `Your Quote status has been updated to ${status}.`,
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
