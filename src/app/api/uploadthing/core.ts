import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/app/db";
const f = createUploadthing();
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
    },
  })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      console.log("input", input);
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("metadata", metadata);
      console.log("file", file);
      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();
      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;
      console.log("imgMetadata", imgMetadata);

      const { configId } = metadata.input;
      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        });

        return { configId: configuration.id };
      } else {
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });
        return { configId: updatedConfiguration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
