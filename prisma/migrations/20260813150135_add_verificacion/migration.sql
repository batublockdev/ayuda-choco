-- CreateTable
CREATE TABLE "Verificacion" (
    "id" TEXT NOT NULL,
    "ayudaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estrellas" INTEGER NOT NULL DEFAULT 5,
    "comentario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verificacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Verificacion" ADD CONSTRAINT "Verificacion_ayudaId_fkey" FOREIGN KEY ("ayudaId") REFERENCES "Ayuda"("id") ON DELETE CASCADE ON UPDATE CASCADE;
