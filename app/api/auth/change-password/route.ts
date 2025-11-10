import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { authOptions } from "../authOptions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "No autenticado" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { message: "Usuario no encontrado o no tiene contraseña establecida" },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "La contraseña actual es incorrecta" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { hashedPassword },
    });

    return NextResponse.json(
      { message: "Contraseña actualizada correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}