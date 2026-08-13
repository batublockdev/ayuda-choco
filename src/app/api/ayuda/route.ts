import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ayudas = await prisma.ayuda.findMany({
      orderBy: { createdAt: "desc" },
      include: { verificaciones: true },
    });
    return NextResponse.json(ayudas);
  } catch (error) {
    console.error("Error fetching ayudas:", error);
    return NextResponse.json(
      { error: "Error al obtener registros" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { nombre, barrio, ciudad, telefono, necesidades, urgencia, lat, lng } = body;

    if (!nombre || !barrio || !necesidades) {
      return NextResponse.json(
        { error: "Nombre, barrio y necesidades son obligatorios" },
        { status: 400 }
      );
    }

    const ayuda = await prisma.ayuda.create({
      data: {
        nombre,
        barrio,
        ciudad: ciudad || "Quibdó",
        telefono: telefono || null,
        necesidades,
        urgencia: urgencia || "URGENTE",
        lat: lat || null,
        lng: lng || null,
      },
    });

    return NextResponse.json(ayuda, { status: 201 });
  } catch (error) {
    console.error("Error creating ayuda:", error);
    return NextResponse.json(
      { error: "Error al registrar" },
      { status: 500 }
    );
  }
}