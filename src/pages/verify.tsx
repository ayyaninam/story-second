"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Routes from "@/routes";
import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";

export const Verify = () => {
	const router = useRouter();

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
		retry: false,
		staleTime: 0,
	});

	const userIsLoggedId = Boolean(data);

	const [error, setError] = useState(false);
	const [emailIsVerified, setEmailIsVerified] = useState(false);
	const emailWasAlreadyVerified = !!data?.data?.emailVerified;

	const redirectToFeed = () => {
		setTimeout(() => {
			router.replace(Routes.Feed()).then();
		}, 5000);
	};

	useEffect(() => {
		if (isLoading || !userIsLoggedId) return;
		if (emailWasAlreadyVerified) {
			redirectToFeed();
			return;
		}

		try {
			api.user.requestVerification().then(
				() => {
					setEmailIsVerified(true);
					redirectToFeed();
				},
				() => {
					setError(true);
				}
			);
		} catch (e) {
			setError(true);
		}
	}, [router, emailWasAlreadyVerified, isLoading]);

	let text = "Verifying email...";
	if (error) {
		text = "There was an error verifying your email.";
	} else if (isLoading) {
		text = "Loading...";
	} else if (!userIsLoggedId) {
		text = "You need to be logged in to verify your email.";
	} else if (emailIsVerified) {
		text = "Email verified! Redirecting in 5 seconds to feed...";
	} else if (emailWasAlreadyVerified) {
		text = "Email was already verified. Redirecting in 5 seconds to feed...";
	}

	return (
		<div className="flex flex-row justify-center items-center mt-8">{text}</div>
	);
};
