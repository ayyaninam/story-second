import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import toast from "react-hot-toast";

const VerifyDialog = () => {
	const { user } = useUser();
	console.log(user?.sid);

	const [open, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	const resendVerificationEmail = async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/send-verification-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_id: user?.sid }), // maybe its "user?.sid" or other value
			});
			const data = await response.json();
			console.log(data);
			if (!response.ok)
				throw new Error(data.message || "Failed to send verification email");
			alert("Verification email sent!");
		} catch (err) {
			// @ts-ignore
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (data && !data?.data?.emailVerified) {
			setTimeout(() => {
				setOpen(true);
			}, 1000);
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Verify Your Email</DialogTitle>
					<DialogDescription>
						Please verify your email. This verification is necessary in order to
						generate a story. Check your inbox for a verification link.
					</DialogDescription>
					<div>
						<Button
							className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit"
							variant="default"
							onClick={resendVerificationEmail}
							disabled={loading}
						>
							Resend my verification email
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default VerifyDialog;
