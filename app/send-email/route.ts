import { Resend } from "resend";
import { NextResponse } from "next/server";
import WelcomeTemplate from "@/emails/WelcomeTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: "no-reply@update.inspedralbes.cat",
      to: "a20edurenlop@inspedralbes.cat",
      subject: "This is a try",
      react: WelcomeTemplate({ name: "Eduard" }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
