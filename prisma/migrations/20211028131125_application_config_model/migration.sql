-- CreateTable
CREATE TABLE "ApplicationConfig" (
    "id" SERIAL NOT NULL,
    "auth0AccessToken" TEXT,

    CONSTRAINT "ApplicationConfig_pkey" PRIMARY KEY ("id")
);
