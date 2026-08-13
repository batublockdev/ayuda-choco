import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const ayuda = await prisma.ayuda.update({
      where: { id },
      data: { ayudado: body.ayudado ?? true },
    });
    return NextResponse.json(ayuda);
  } catch (error) {
    console.error("Error updating ayuda:", error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.ayuda.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting ayuda:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}