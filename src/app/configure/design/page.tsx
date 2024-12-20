import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}
const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

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
    <DesignConfigurator
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
