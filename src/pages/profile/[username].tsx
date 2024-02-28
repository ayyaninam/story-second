"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import validator from "validator";
import { ProfileForm } from "@/features/profile/Profile";
import { PreferencesForm } from "@/features/profile/PreferencesForm";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import { pick } from "lodash";
import { parse, parseISO, subDays } from "date-fns";

const profileSchema = z.object({
	profileName: z
		.string({ required_error: "Username is required" })
		.min(1, "Please enter username"),
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
	bio: z
		.string({ required_error: "Bio is required" })
		.min(50, "Bio should contain atleast 50 characters")
		.max(1500, "Bio should be lest than 1500 character"),
	name: z
		.string({ required_error: "First name is required" })
		.min(1, "First name is required"),
	lastName: z
		.string({ required_error: "Last name is required" })
		.min(1, "Last name is required"),
	phoneNumber: z
		.string({ required_error: "Phone is required" })
		.regex(
			/^\+?\d{1,4}?[-.\s]?((\(?\d{1,3}?\)?[-.\s]?)?(\d{1,4}[-.\s]?)*\d{1,4}|\d{10})$/,
			"Invalid Phone number"
		)
		.refine(validator.isMobilePhone),
	dateOfBirth: z
		.date({ required_error: "DOB is required" })
		.max(subDays(new Date(), 1), "Invalid DOB"),
});

const preferenceSchema = z.object({
	storyVisibility: z.boolean(),
	amazonStatus: z.boolean(),
	tokenPurchase: z.boolean(),
	tokenUsage: z.boolean(),
	lowBalance: z.boolean(),
	storyGenerated: z.boolean(),
	reportUpdated: z.boolean(),
	commentUsage: z.boolean(),
});

type Profile = z.infer<typeof profileSchema>;

const Profile = () => {
	const router = useRouter();
	const { username, step = "profile" } = router.query ?? {};

	const { data, isPending, refetch } = useQuery({
		queryKey: [QueryKeys.USER, username],
		queryFn: () => api.user.get(),
		enabled: !!username,
	});

	const basicDetails: Record<string, any> = useMemo(() => {
		if (!data?.data) {
			return {};
		}
		const _basicDetails: Record<string, any> = pick(data.data, [
			"name",
			"email",
			"lastName",
			"bio",
			"profileName",
			"phoneNumber",
			"dateOfBirth",
		]);

		if (_basicDetails?.dateOfBirth) {
			_basicDetails["dateOfBirth"] = parseISO(_basicDetails.dateOfBirth);
		}

		return _basicDetails;
	}, [data]);

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: basicDetails,
	});

	useEffect(() => {
		if (Object.keys(basicDetails).length === 0) {
			return;
		}
		form.reset(basicDetails);
	}, [form, basicDetails]);

	const preferenceForm = useForm({
		resolver: zodResolver(preferenceSchema),
		defaultValues: {
			storyVisibility: true,
			amazonStatus: true,
			tokenPurchase: false,
			tokenUsage: false,
			lowBalance: false,
			storyGenerated: false,
			reportUpdated: false,
			commentUsage: true,
		},
	});

	useEffect(() => {
		if (!router.isReady) {
			return;
		}
		if (!username) {
			router.replace("/");
		}
	}, [router, username]);

	const onClickNavMenu = useCallback(
		(item: string) => {
			router.query.step = item;
			router.push(router);
		},
		[router]
	);

	return (
		<>
			<Head>
				<title>Profile - {username}</title>
			</Head>
			<div className="max-w-full min-h-screen bg-background p-14">
				<p className="text-3xl font-bold">Settings</p>
				<p className="text-base font-extralight text-muted-foreground">
					Manage your account settings and set e-mail preferences.
				</p>
				<hr className="mt-8" />
				<div className="flex">
					<div className="w-2/12">
						<ToggleGroup
							value={step as string}
							type="single"
							className="flex flex-col space-y-2 mt-5"
							onValueChange={onClickNavMenu}
						>
							<ToggleGroupItem value="profile" className="w-full justify-start">
								Profile
							</ToggleGroupItem>
							<ToggleGroupItem
								value="amazonStatus"
								className="w-full justify-start"
							>
								Amazon Status
							</ToggleGroupItem>
							<ToggleGroupItem
								value="my-items"
								className="w-full justify-start"
							>
								My Items
							</ToggleGroupItem>
							<ToggleGroupItem value="payouts" className="w-full justify-start">
								Payouts
							</ToggleGroupItem>
							<ToggleGroupItem value="payment" className="w-full justify-start">
								Payment Details
							</ToggleGroupItem>
							<ToggleGroupItem value="wallets" className="w-full justify-start">
								Wallets
							</ToggleGroupItem>
							<ToggleGroupItem
								value="preferences"
								className="w-full justify-start"
							>
								Preferences
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
					{isPending ? (
						<p className="ml-28 mt-10">Loading...</p>
					) : (
						<div id="tab-section" className="ml-28 w-4/6">
							<div className="py-8">
								{step === "profile" && (
									<>
										<p className="text-2xl font-bold">Profile</p>
										<p className="text-base font-extralight text-muted-foreground">
											This is how others will see you on the site.
										</p>
										<Separator className="my-8" />
										<ProfileForm<Profile> form={form} refetch={refetch} />
									</>
								)}
								{step === "amazonStatus" && (
									<>
										<h1>Still in progress...</h1>
									</>
								)}
								{step === "my-items" && (
									<>
										<h1>Still in progress...</h1>
									</>
								)}
								{step === "payouts" && (
									<>
										<h1>Still in progress...</h1>
									</>
								)}
								{step === "payment" && (
									<>
										<h1>Still in progress...</h1>
									</>
								)}
								{step === "wallets" && (
									<>
										<h1>Still in progress...</h1>
									</>
								)}
								{step === "preferences" && (
									<>
										<PreferencesForm form={preferenceForm} />
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Profile;
