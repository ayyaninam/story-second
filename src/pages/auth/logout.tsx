import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutPage() {
	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		queryClient.clear();
		queryClient.removeQueries();
		router.reload();
		router.push(`/api/auth/logout`);
	}, [queryClient, router]);
	return <div>Logging you out...</div>;
}
