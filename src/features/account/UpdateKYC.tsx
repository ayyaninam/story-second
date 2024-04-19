import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { CountryListBox } from "@/features/account/components/create-payouts-account-modal";
import FormError from "@/components/FormError";
import { compressImage } from "@/utils/image-utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const kycSchema = z.object({
	photoIDType: z.string().min(1, "Verification Document Type is required"),
	photoIDNumber: z.string().min(1, "Document ID Number is required"),
	address: z.string().min(1, "Address is required"),
	country: z.string().min(1, "Country is required"),
});

const UpdateKYCForm = () => {
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>("");
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(kycSchema),
		defaultValues: {
			photoIDType: "Passport",
			photoIDNumber: "",
			address: "",
			country: "US",
		},
	});

	const { mutateAsync: updateKYC } = useMutation({
		mutationFn: api.user.updateKYC,
	});

	useEffect(() => {
		return () => {
			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			if (!file) return;
			try {
				const compressedBlob = await compressImage(file, 5, 1920);
				const compressedFile = new File([compressedBlob], file?.name, {
					type: compressedBlob.type,
				});
				setImage(compressedFile);
				setImagePreview(URL.createObjectURL(compressedFile));
			} catch (error) {
				toast.error("Error compressing image");
			}
		}
	};

	const onSubmit = async (data: any) => {
		if (!image) {
			toast.error("Please upload a photo ID");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("photoIDType", data.photoIDType);
			formData.append("photoIDNumber", data.photoIDNumber);
			formData.append("address", data.address);
			formData.append("country", data.country);
			formData.append("photoId", image);

			console.log("formData", formData);
			for (let [key, value] of formData.entries()) {
				console.log(key, value);
			}

			await updateKYC(formData);
			toast.success("KYC details submitted successfully");
			router.push("/account?step=payouts");
		} catch (error) {
			toast.error("Failed to submit KYC details");
		}
	};

	return (
		<>
			<div className="w-full flex-1 flex flex-col">
				<h1 className="text-3xl font-semibold">KYC Verification Form</h1>
				<div
					className="w-full h-1 bg-primary-500 my-4 rounded"
					role="separator"
				/>
				<div className="max-w-xl mx-auto p-6 rounded-md shadow-md">
					<p className="mb-6 text-lg font-semibold">
						Please complete the KYC process to receive your payments.
					</p>
					<FormProvider {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-6"
						>
							{/* Image Upload Section */}
							<div className="flex flex-col gap-2">
								<label className="text-md">Upload Verification Document</label>
								<input
									type="file"
									onChange={handleImageChange}
									className="cursor-pointer"
								/>
								{imagePreview && (
									<Image
										src={imagePreview}
										alt="Preview of chosen image"
										height={256}
										width={256}
										className="rounded-md"
									/>
								)}
							</div>
							{/* Form Fields */}
							<select
								{...form.register("photoIDType")}
								className="p-2 rounded-md border"
							>
								<option value="Passport">Passport</option>
								<option value="DriversLicence">Driver&apos;s License</option>
								<option value="NationalID">National ID</option>
								{/* Add other document types as needed */}
							</select>
							<input
								{...form.register("photoIDNumber")}
								type="text"
								placeholder="Document ID Number"
								className="p-2 rounded-md border"
							/>
							<textarea
								{...form.register("address")}
								placeholder="Enter your address"
								className="p-2 rounded-md border h-24"
							/>
							<CountryListBox
								selectedCountry={form.watch("country")}
								setSelectedCountry={(value) =>
									form.setValue("country", value.toString())
								}
							/>

							{/* Displaying form errors */}
							<FormError control={form.control} name="photoIDType" />
							<FormError control={form.control} name="photoIDNumber" />
							<FormError control={form.control} name="address" />
							<FormError control={form.control} name="country" />

							<Button type="submit" className={`mt-4`}>
								Submit KYC Details
							</Button>
						</form>
					</FormProvider>
				</div>
			</div>
		</>
	);
};

export default UpdateKYCForm;
