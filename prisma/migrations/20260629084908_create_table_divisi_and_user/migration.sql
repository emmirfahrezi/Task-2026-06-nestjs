-- CreateTable
CREATE TABLE "divisi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "divisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "divisi_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_divisi_id_fkey" FOREIGN KEY ("divisi_id") REFERENCES "divisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
