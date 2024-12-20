"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./action";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const id = localStorage.getItem("configurationId");
    if (id) {
      setConfigId(id);
    }
  }, []);
  //   将用户存到数据库
  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });
  if (data?.success) {
    if (configId) {
      localStorage.removeItem("configurationId");
      router.push(`/configure/preview?id=${configId}`);
    } else {
      router.push(`/`);
    }
  }
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500"></Loader2>
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>Your will be redirected automatically</p>
      </div>
    </div>
  );
};
export default Page;
