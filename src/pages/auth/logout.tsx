import { useRouter } from "next/router";
import { useEffect } from "react";
import {QueryClient} from "@tanstack/react-query";

export default function LogoutPage() {
  const router = useRouter();
  const [queryClient] = React.useState(() => new QueryClient());
  useEffect(() => {
    queryClient.clear();
    router.push(`/api/auth/logout?returnTo=/feed`);
  }, [router]);
  return <div>Logging you out...</div>;
}
