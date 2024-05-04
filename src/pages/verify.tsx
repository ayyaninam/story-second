"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Routes from "@/routes";
import api from "@/api";

export const Verify = () => {
	const router = useRouter();

	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [error, setError] = useState(false);
	const [referrerURL, setReferrerURL] = useState("");
	const [cameFromAuth0, setCameFromAuth0] = useState(true);

	useEffect(() => {
		const referrer = document.referrer;
		const auth0Host = "www.auth0-todo-change-with-real-one.com"; // todo: update this value with the "referrerURL" value that it gets when using auth0

		if (!referrer) {
			setCameFromAuth0(false);
			return;
		}

		try {
			const referrerURL = new URL(referrer);
			setReferrerURL(referrerURL.host);

			if (referrerURL.host === auth0Host) {
				api.user.requestVerification().then();

				setIsEmailVerified(true);
			} else {
				setCameFromAuth0(false);
			}
		} catch (err) {
			console.error(err);
			setError(true);
		}
	}, []);

	useEffect(() => {
		if (isEmailVerified) {
			setTimeout(() => {
				router.replace(Routes.Feed()).then();
			}, 5000);
		}
	}, [router, isEmailVerified]);

	if (error) {
		return (
			<div className="flex flex-row justify-center items-center mt-8">
				There was an error verifying your email. | referrerURL: &quot;
				{referrerURL}&quot;
			</div>
		);
	}

	if (!cameFromAuth0) {
		return (
			<div className="flex flex-row justify-center items-center mt-8">
				The user didnt came from Auth0, it should redirect to /feed but for now
				this logic is disabled | referrerURL: &quot;{referrerURL}&quot;
			</div>
		);
	}

	if (isEmailVerified) {
		return (
			<div className="flex flex-row justify-center items-center mt-8">
				Email verified! redirecting in 5 seconds to feed... | referrerURL:
				&quot;
				{referrerURL}&quot;
			</div>
		);
	}

	return (
		<div className="flex flex-row justify-center items-center mt-8">
			Verifying email... | referrerURL: &quot;{referrerURL}&quot;
		</div>
	);
};

export default Verify;
