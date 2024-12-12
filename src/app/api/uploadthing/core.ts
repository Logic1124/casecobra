import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/app/db";
const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ configId: z.string().optional() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      //   const user = await auth(req);
      // If you throw, the user will not be able to upload
      //   if (!user) throw new UploadThingError("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      //   return { userId: user.id };
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      //   console.log("Upload complete for userId:", metadata.input.configId);
      const res = await fetch(file.url);
      //   console.log("file url", file.url);
      const buffer = await res.arrayBuffer();
      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;
      const { configId } = metadata.input;
      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500,
            width: width || 500,
          },
        });
        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
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
