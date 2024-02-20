"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Control, useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { get } from "lodash";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Head from "next/head";
import validator from "validator";
import { ProfileForm } from "@/features/profile/Profile";
import { PreferencesForm } from "@/features/profile/PreferencesForm";

const profileSchema = z.object({
	username: z
		.string({ required_error: "Username is required" })
		.min(1, "Please enter username"),
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
	bio: z
		.string({ required_error: "Bio is required" })
		.min(50, "Bio should contain atleast 50 characters")
		.max(1500, "Bio should be lest than 1500 character"),
	firstName: z
		.string({ required_error: "First name is required" })
		.min(1, "First name is required"),
	lastName: z
		.string({ required_error: "Last name is required" })
		.min(1, "Last name is required"),
	phone: z
		.string({ required_error: "Phone is required" })
		.refine(validator.isMobilePhone),
	dateOfBirth: z.date({ required_error: "DOB is required" }),
});

type Profile = z.infer<typeof profileSchema>;

const Profile = () => {
	const router = useRouter();
	const { username, step = "profile" } = router.query ?? {};

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "abc",
			bio: "etetetet",
			email: "",
			dateOfBirth: new Date(),
			phone: "",
		},
	});

	const preferenceForm = useForm({
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
					<div id="tab-section" className="ml-28 w-4/6">
						<div className="py-8">
							{step === "profile" && (
								<>
									<p className="text-2xl font-bold">Profile</p>
									<p className="text-base font-extralight text-muted-foreground">
										This is how others will see you on the site.
									</p>
									<Separator className="my-8" />
									<ProfileForm<Profile> form={form} />
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
				</div>
			</div>
		</>
	);
};

export default Profile;
