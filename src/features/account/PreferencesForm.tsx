import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import toast from "react-hot-toast";

const PreferenceInput = ({
	name,
	form,
	label,
	title,
	description,
	rightLabel,
	className,
}: {
	name: string;
	form: UseFormReturn<any>;
	label?: string;
	title: string;
	description: string;
	rightLabel?: string;
	className?: string;
}) => {
	const preferenceValues = form.watch(name);
	return (
		<div className={clsx("flex items-center", className)}>
			<div className="w-full">
				<p className="font-bold">{title}</p>
				<p className="text-sm mt-2 text-muted-foreground">{description}</p>
			</div>
			<div className="flex items-center space-x-2 ml-10">
				{label && <Label htmlFor={name}>{label}</Label>}
				<Switch
					className="data-[state=checked]:bg-accent-500 data-[state=unchecked]:bg-accent-200"
					{...form.register(name, { required: true })}
					onCheckedChange={(checked) => {
						form.setValue(name, checked);
						form.trigger(name);
					}}
					checked={preferenceValues}
					// checked={form.getValues()?.[name]}
				/>
				{rightLabel && <Label htmlFor={name}>Public</Label>}
			</div>
		</div>
	);
};

type PreferenceFormData = {
	storyVisibility: boolean;
	// amazonStatus: boolean; // commented for future referencee
	// tokenPurchase: boolean;
	// tokenUsage: boolean;
	// lowBalance: boolean;
	// storyGenerated: boolean;
	// reportUpdated: boolean;
	// commentUsage: boolean;
};
const preferenceSchema = z.object({
	storyVisibility: z.boolean(),
	// amazonStatus: z.boolean(),
	// tokenPurchase: z.boolean(),
	// tokenUsage: z.boolean(),
	// lowBalance: z.boolean(),
	// storyGenerated: z.boolean(),
	// reportUpdated: z.boolean(),
	// commentUsage: z.boolean(),
});

export const PreferencesForm = () => {
	const User = useQuery<mainSchema["UserInfoDTOApiResponse"]>({
		queryFn: () => api.user.get(),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});

	const form = useForm<PreferenceFormData>({
		resolver: zodResolver(preferenceSchema),
		defaultValues: {
			storyVisibility: true,
			// amazonStatus: true,
			// tokenPurchase: false,
			// tokenUsage: false,
			// lowBalance: false,
			// storyGenerated: false,
			// reportUpdated: false,
			// commentUsage: true,
		},
	});

	useEffect(() => {
		if (User?.data) {
			form.reset({
				storyVisibility: User?.data?.data?.defaultPublic,
			});
		}
	}, [User?.data, form]);

	const onSubmit = useCallback(async (values: PreferenceFormData) => {
		try {
			// @ts-ignore is not required to send all values
			await api.user.updatePreferences({
				defaultPublic: values.storyVisibility,
			});
			toast.success("Preferences updated successfully");
		} catch (e) {
			console.error(e);
			toast.error("Failed to update preferences");
		}
	}, []);

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
				<PreferenceInput
					description="All content will be visible to the public. Note: this will NOT affect existing stories."
					title="Default Public Visibility"
					form={form}
					name="storyVisibility"
				/>
				{/*<PreferenceInput*/}
				{/*	description="Receive updates on your Amazon Publish Status: Request, Processing, Published or Rejected."*/}
				{/*	title="Amazon Publishing Status"*/}
				{/*	form={form}*/}
				{/*	name="amazonStatus"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates on purchases made [highly recommended]."*/}
				{/*	title="Purchase Updates"*/}
				{/*	form={form}*/}
				{/*	name="tokenPurchase"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates on your credits usage."*/}
				{/*	title="Credit Usage"*/}
				{/*	form={form}*/}
				{/*	name="tokenUsage"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates on your balance running out and requiring replenishment."*/}
				{/*	title="Low Account Balance"*/}
				{/*	form={form}*/}
				{/*	name="lowBalance"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates when your story completes generating."*/}
				{/*	title="Story Generated"*/}
				{/*	form={form}*/}
				{/*	name="storyGenerated"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates when you report a story."*/}
				{/*	title="Report Updates"*/}
				{/*	form={form}*/}
				{/*	name="reportUpdated"*/}
				{/*/>*/}
				{/*<PreferenceInput*/}
				{/*	description="Receive updates when your story receive new comments."*/}
				{/*	title="Comment Updates"*/}
				{/*	form={form}*/}
				{/*	name="commentUsage"*/}
				{/*/>*/}
				<div className="flex justify-center">
					<Button type="submit" className="bg-accent-500 hover:bg-accent-700">
						Save Preferences
					</Button>
				</div>
			</form>
		</FormProvider>
	);
};
