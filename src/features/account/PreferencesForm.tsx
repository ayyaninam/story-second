import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { useCallback } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";

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

export const PreferencesForm = ({ form }: { form: UseFormReturn<any> }) => {
	const onSubmit = useCallback((values: any) => {}, []);
	return (
		<>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
					<PreferenceInput
						description="All content will be visible to the public. Note: toggle will NOT affect existing stories."
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
					<PreferenceInput
						description="Receive updates on purchases made [highly recommended]."
						title="Purchase Updates"
						form={form}
						name="tokenPurchase"
					/>
					<PreferenceInput
						description="Receive updates on your credits usage."
						title="Credit Usage"
						form={form}
						name="tokenUsage"
					/>
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
		</>
	);
};
