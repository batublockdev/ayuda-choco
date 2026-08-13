import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ayudaId = searchParams.get("ayudaId");

    const where = ayudaId ? { ayudaId } : {};
    const verificaciones = await prisma.verificacion.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(verificaciones);
  } catch (error) {
    console.error("Error fetching verificaciones:", error);
    return NextResponse.json({ error: "Error al obtener verificaciones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ayudaId, nombre, estrellas, comentario } = body;

    if (!ayudaId || !nombre || !comentario) {
      return NextResponse.json(
        { error: "AyudaId, nombre y comentario son obligatorios" },
        { status: 400 }
      );
    }

    const verificacion = await prisma.verificacion.create({
      data: {
        ayudaId,
        nombre,
        estrellas: estrellas || 5,
        comentario,
      },
    });

    return NextResponse.json(verificacion, { status: 201 });
  } catch (error) {
    console.error("Error creating verificacion:", error);
    return NextResponse.json({ error: "Error al crear verificación" }, { status: 500 });
  }
}