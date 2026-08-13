-- CreateEnum
CREATE TYPE "Urgencia" AS ENUM ('CRITICA', 'URGENTE', 'MODERADA');

-- CreateTable
CREATE TABLE "Ayuda" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "barrio" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL DEFAULT 'Quibdó',
    "telefono" TEXT,
    "necesidades" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "urgencia" "Urgencia" NOT NULL DEFAULT 'URGENTE',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "ayudado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ayuda_pkey" PRIMARY KEY ("id")
);
