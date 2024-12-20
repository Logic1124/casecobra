import { db } from "@/app/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;
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
  return <DesignPreview configuration={configuration} />;
};
export default Page;
