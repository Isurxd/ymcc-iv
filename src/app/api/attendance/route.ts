import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { registrationId } = await req.json();
    
    // Validate registration exists
    const reg = await prisma.registration.findUnique({
       where: { id: registrationId },
       include: { user: true, event: true }
    });

    if (!reg) {
       return NextResponse.json({ 
          success: false, 
          status: 'INVALID', 
          message: `ID ${registrationId} tidak terdaftar di sistem` 
       }, { status: 404 });
    }

    // Jika payment status masih PENDING_PAYMENT atau REJECTED, bisa dianggap attendance invalid,
    // tapi tergantung flow. Kita set warning jika belum APPROVED.
    const isValid = reg.status === "APPROVED";

    // Create attendance record
    const attendance = await prisma.attendance.create({
       data: {
          registrationId: reg.id,
          eventId: reg.eventId,
          status: isValid ? "VALID" : "INVALID_REG_STATUS",
       }
    });

    return NextResponse.json({
       success: true,
       status: isValid ? "VALID" : "WARNING",
       message: isValid ? `Scan Sukses: ${reg.user.name}` : `Warning: Status Registrasi ${reg.status}`,
       data: reg
    });

  } catch (error: any) {
    console.error("Attendance scan error:", error);
    return NextResponse.json({ success: false, status: 'ERROR', message: error.message }, { status: 500 });
  }
}

export async function GET() {
   try {
     const logs = await prisma.attendance.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { registration: { include: { user: true } } }
     });
     return NextResponse.json(logs);
   } catch (error) {
      return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
   }
}
