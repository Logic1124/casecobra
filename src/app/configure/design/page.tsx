import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesingConfigurator from "./DesingConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
const Page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams;

  // make db call
  if (!id || typeof id !== "string") {
    return notFound();
  }
  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });
  if (!configuration) {
    return notFound();
  }
  const { width, height, imageUrl } = configuration;
  return (
    <DesingConfigurator
      configId={configuration.id}
      imageUrl={imageUrl}
      imageDimensions={{
        width: width,
        height: height,
      }}
    />
  );
};
export default Page;
