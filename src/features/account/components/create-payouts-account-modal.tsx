import React, { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Dialog,
} from "@/components/ui/dialog"; // Adjust import paths as necessary
import { Button } from "@/components/ui/button"; // Adjust import paths as necessary
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import FormError from "@/components/FormError";

export const COUNTRY_CODES = [
	{ key: "US", value: "United States" },
	{ key: "AE", value: "United Arab Emirates" },
	{ key: "AG", value: "Antigua and Barbuda" },
	{ key: "AF", value: "Afghanistan" },
	{ key: "AL", value: "Albania" },
	{ key: "AM", value: "Armenia" },
	{ key: "AR", value: "Argentina" },
	{ key: "AT", value: "Austria" },
	{ key: "AU", value: "Australia" },
	{ key: "BA", value: "Bosnia and Herzegovina" },
	{ key: "BE", value: "Belgium" },
	{ key: "BG", value: "Bulgaria" },
	{ key: "BH", value: "Bahrain" },
	{ key: "BO", value: "Bolivia" },
	{ key: "BS", value: "Bahamas" },
	{ key: "CA", value: "Canada" },
	{ key: "CH", value: "Switzerland" },
	{ key: "CI", value: "Cote d'Ivoire" },
	{ key: "CL", value: "Chile" },
	{ key: "CO", value: "Colombia" },
	{ key: "CR", value: "Costa Rica" },
	{ key: "CY", value: "Cyprus" },
	{ key: "CZ", value: "Czechia" },
	{ key: "DE", value: "Germany" },
	{ key: "DK", value: "Denmark" },
	{ key: "DO", value: "Dominican Republic" },
	{ key: "EC", value: "Ecuador" },
	{ key: "EE", value: "Estonia" },
	{ key: "EG", value: "Egypt" },
	{ key: "ES", value: "Spain" },
	{ key: "ET", value: "Ethiopia" },
	{ key: "FI", value: "Finland" },
	{ key: "FR", value: "France" },
	{ key: "GB", value: "United Kingdom" },
	{ key: "GH", value: "Ghana" },
	{ key: "GM", value: "Gambia" },
	{ key: "GR", value: "Greece" },
	{ key: "GT", value: "Guatemala" },
	{ key: "GY", value: "Guyana" },
	{ key: "HK", value: "Hong Kong" },
	{ key: "HR", value: "Croatia" },
	{ key: "HU", value: "Hungary" },
	{ key: "ID", value: "Indonesia" },
	{ key: "IE", value: "Ireland" },
	{ key: "IL", value: "Israel" },
	{ key: "IS", value: "Iceland" },
	{ key: "IT", value: "Italy" },
	{ key: "IN", value: "India" },
	{ key: "JM", value: "Jamaica" },
	{ key: "JO", value: "Jordan" },
	{ key: "JP", value: "Japan" },
	{ key: "KE", value: "Kenya" },
	{ key: "KH", value: "Cambodia" },
	{ key: "KR", value: "Republic of Korea" },
	{ key: "KW", value: "Kuwait" },
	{ key: "LC", value: "Saint Lucia" },
	{ key: "LI", value: "Liechtenstein" },
	{ key: "LK", value: "Sri Lanka" },
	{ key: "LT", value: "Lithuania" },
	{ key: "LU", value: "Luxembourg" },
	{ key: "LV", value: "Latvia" },
	{ key: "MA", value: "Morocco" },
	{ key: "MD", value: "Republic of Moldova" },
	{ key: "MG", value: "Madagascar" },
	{ key: "MK", value: "Macedonia" },
	{ key: "MN", value: "Mongolia" },
	{ key: "MO", value: "Macao" },
	{ key: "MT", value: "Malta" },
	{ key: "MU", value: "Mauritius" },
	{ key: "MX", value: "Mexico" },
	{ key: "MY", value: "Malaysia" },
	{ key: "NA", value: "Namibia" },
	{ key: "NG", value: "Nigeria" },
	{ key: "NL", value: "Netherlands" },
	{ key: "NO", value: "Norway" },
	{ key: "NZ", value: "New Zealand" },
	{ key: "OM", value: "Oman" },
	{ key: "PA", value: "Panama" },
	{ key: "PE", value: "Peru" },
	{ key: "PH", value: "Philippines" },
	{ key: "PL", value: "Poland" },
	{ key: "PT", value: "Portugal" },
	{ key: "PY", value: "Paraguay" },
	{ key: "QA", value: "Qatar" },
	{ key: "RO", value: "Romania" },
	{ key: "RS", value: "Serbia" },
	{ key: "RW", value: "Rwanda" },
	{ key: "SA", value: "Saudi Arabia" },
	{ key: "SE", value: "Sweden" },
	{ key: "SG", value: "Singapore" },
	{ key: "SI", value: "Slovenia" },
	{ key: "SK", value: "Slovakia" },
	{ key: "SN", value: "Senegal" },
	{ key: "SV", value: "El Salvador" },
	{ key: "TH", value: "Thailand" },
	{ key: "TN", value: "Tunisia" },
	{ key: "TR", value: "Turkey" },
	{ key: "TT", value: "Trinidad and Tobago" },
	{ key: "TW", value: "Taiwan" },
	{ key: "TZ", value: "Tanzania" },
	{ key: "UY", value: "Uruguay" },
	{ key: "UZ", value: "Uzbekistan" },
	{ key: "VN", value: "Vietnam" },
	{ key: "ZA", value: "South Africa" },
	{ key: "BD", value: "Bangladesh" },
	{ key: "BJ", value: "Benin" },
	{ key: "MC", value: "Monaco" },
	{ key: "NE", value: "Niger" },
	{ key: "SM", value: "San Marino" },
	{ key: "AZ", value: "Azerbaijan" },
	{ key: "BN", value: "Brunei Darussalam" },
	{ key: "BT", value: "Bhutan" },
	{ key: "AO", value: "Angola" },
	{ key: "DZ", value: "Djibouti" },
	{ key: "BW", value: "Botswana" },
	{ key: "GA", value: "Gabon" },
	{ key: "LA", value: "Laos" },
	{ key: "MZ", value: "Mozambique" },
	{ key: "KZ", value: "Kazakhstan" },
	{ key: "PK", value: "Pakistan" },
];

export const CountryListBox = ({
	selectedCountry,
	setSelectedCountry,
}: {
	selectedCountry: string;
	setSelectedCountry: Dispatch<SetStateAction<string>>;
}) => {
	return (
		<div className="relative mt-1">
			<select
				value={selectedCountry}
				onChange={(e) => setSelectedCountry(e.target.value)}
				className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md shadow-sm"
			>
				{COUNTRY_CODES.map((country, idx) => (
					<option key={idx} value={country.key}>
						{country.value}
					</option>
				))}
			</select>
		</div>
	);
};

const payoutAccountSchema = z
	.object({
		accountType: z.enum(["Individual", "Business"]),
		firstName: z.string().optional(), // Made optional initially
		lastName: z.string().optional(), // Made optional initially
		companyName: z.string().optional(), // Made optional initially
		country: z.string().min(1, "Country is required"),
	})
	.refine(
		(data) =>
			data.accountType === "Individual"
				? data.firstName && data.lastName
				: data.companyName,
		{
			message:
				"First name and last name are required for individuals, and company name is required for businesses.",
			path: ["accountType"], // Adjust the path as necessary, or use multiple paths if you want to highlight specific fields
		}
	);

type FormInputs = {
	accountType: string;
	firstName: string;
	lastName: string;
	companyName: string;
	country: string;
};

const CreatePayoutsAccountModal = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(payoutAccountSchema),
		defaultValues: {
			accountType: "Individual",
			firstName: "",
			lastName: "",
			companyName: "",
			country: "US",
		},
	});

	const setupPayoutAccount = useMutation({
		mutationFn: api.user.setupPaymentAccount,
	});

	const handleSubmit: SubmitHandler<FormInputs> = async (formInputs) => {
		try {
			const payoutAccountResponse = await setupPayoutAccount.mutateAsync({
				individualBusinessType: formInputs.accountType === "Individual",
				firstName: formInputs.firstName,
				lastName: formInputs.lastName,
				companyName: formInputs.companyName,
				country: formInputs.country,
			});

			if (payoutAccountResponse.url) {
				window.location.href = payoutAccountResponse.url;
			} else {
				toast.error("Failed to create payout account");
			}
		} catch (e: any) {
			toast.error("Failed to process your request");
		} finally {
			setDialogOpen(false);
		}
	};

	return (
		<>
			<Button onClick={() => setDialogOpen(true)} className="btn-primary">
				Get Started
			</Button>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="p-4">
					<DialogHeader>
						<DialogTitle>Create Payout Account</DialogTitle>
						<DialogDescription>
							You need to create a Stripe payout account to receive your
							royalties.
						</DialogDescription>
					</DialogHeader>

					<FormProvider {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="mt-4 space-y-4"
						>
							<div>
								<label>
									<input
										{...form.register("accountType")}
										type="radio"
										value="Individual"
									/>
									<span className="ml-1">Individual</span>
								</label>
								<label>
									<input
										{...form.register("accountType")}
										type="radio"
										value="Business"
										className="ml-2"
									/>
									<span className="ml-1">Business</span>
								</label>
							</div>

							<CountryListBox
								selectedCountry={form.watch("country")}
								setSelectedCountry={(value) =>
									form.setValue("country", value.toString())
								}
							/>

							{form.watch("accountType") === "Individual" && (
								<>
									<Input
										{...form.register("firstName")}
										type="text"
										placeholder="First Name"
									/>
									<Input
										{...form.register("lastName")}
										type="text"
										placeholder="Last Name"
									/>
								</>
							)}

							{form.watch("accountType") === "Business" && (
								<Input
									{...form.register("companyName")}
									type="text"
									placeholder="Company Name"
								/>
							)}

							<FormError control={form.control} name="accountType" />
							<FormError control={form.control} name="firstName" />
							<FormError control={form.control} name="lastName" />
							<FormError control={form.control} name="companyName" />
							<FormError control={form.control} name="country" />

							<div className="flex justify-end gap-4 mt-4">
								<Button type="submit" isLoading={form.formState.isSubmitting}>
									Create Account
								</Button>
							</div>
						</form>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default CreatePayoutsAccountModal;
