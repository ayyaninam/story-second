import api from "@/api";
import Error from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QueryKeys } from "@/lib/queryKeys";
import {
	QueryObserverResult,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { startCase } from "lodash";
import { useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";

export const ProfileForm = <T extends FieldValues>({
	form,
	refetch,
}: {
	form: UseFormReturn<T | any, any, T>;
	refetch: QueryObserverResult["refetch"];
}) => {
	const value = form.watch("dateOfBirth");

	const { mutateAsync, isPending: isUpdating } = useMutation({
		mutationKey: [QueryKeys.USER, QueryKeys.UPDATE],
		mutationFn: async (data: T) => {
			const transformedData: Record<string, any> = {};
			Object.entries(data).forEach(([key, value]) => {
				const _key = startCase(key).replaceAll(" ", "");
				if (_key === "DateOfBirth") {
					// Need to transform the selected date into backend supported value
					const _value = format(value, "yyyy-MM-dd");
					transformedData[_key] = _value;
					return;
				}
				transformedData[_key] = value;
			});
			return api.user.updateDetails<T>(transformedData as T);
		},
		onSuccess: async () => {
			toast.success("Updated info");
			await refetch?.();
		},
		onError: () => {
			toast.error("Failed to save");
		},
	});

	const onSave = useCallback(async () => {
		await mutateAsync(form.getValues());
	}, [form, mutateAsync]);

	return (
		<form onSubmit={form.handleSubmit(onSave)} className="space-y-5">
			<div className="flex space-x-20">
				<div className="w-5/12">
					<Label htmlFor="firstName">First name</Label>
					<Input
						{...form.register("name", { required: true })}
						type="text"
						className="w-full mt-2"
					/>
					<Error control={form.control} name="firstName" />
				</div>
				<div className="w-5/12">
					<Label htmlFor="lastName">Last name</Label>
					<Input
						{...form.register("lastName", { required: true })}
						type="text"
						className="w-full mt-2"
					/>
					<Error control={form.control} name="lastName" />
				</div>
			</div>
			<div className="flex space-x-20">
				<div className="w-5/12">
					<Label htmlFor="username">Username</Label>
					<Input
						{...form.register("profileName", { required: true })}
						type="text"
						className="w-full mt-2"
					/>
					<span className="text-sm text-muted-foreground block">
						This is your public display name. It can be your real name or a
						pseudonym. You can only change this once every 30 days.
					</span>
					<Error control={form.control} name="username" />
				</div>
				<div className="w-5/12 ">
					<Label htmlFor="email">Email</Label>
					<Input
						{...form.register("email", { required: true })}
						className="w-full mt-2"
					/>
					<Error control={form.control} name="email" />
				</div>
			</div>
			<div className="flex space-x-20">
				<div className="mb-6 flex flex-col w-5/12">
					<Label htmlFor="phone" className="mt-2">
						Date of Birth
					</Label>
					<DatePicker
						className="w-full mt-3"
						onChange={(value) => {
							form.setValue("dateOfBirth", value);
						}}
						value={value}
					/>
					<Error control={form.control} name="username" />
				</div>
				<div className="mb-6 w-5/12">
					<Label htmlFor="phone">Phone</Label>
					<Input
						{...form.register("phoneNumber", {
							required: true,
						})}
						type="text"
						className="w-full mt-2"
					/>
					<Error control={form.control} name="username" />
				</div>
			</div>
			<div className="w-5/12">
				<Label htmlFor="bio">Bio</Label>
				<Textarea
					{...form.register("bio", { required: true })}
					className="w-full mt-2"
				/>
				<Error control={form.control} name="bio" />
			</div>
			<Button isLoading={isUpdating} type="submit" className="bg-purple-500">
				Update Profile
			</Button>
		</form>
	);
};
