import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/api/auth/logout?returnTo=/feed`);
  }, [router]);
  return <div>Logging you out...</div>;
}
