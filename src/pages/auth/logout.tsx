import { removeJwt } from "@/utils/jwt";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LogoutPage() {
	const router = useRouter();
	useEffect(() => {
		removeJwt();
		router.push(`/api/auth/logout?returnTo=/explore`);
	}, [router]);
	return <div>Logging you out...</div>;
}
