import Error from "@/components/FormError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export const ProfileForm = <T extends FieldValues>({
	form,
}: {
	form: UseFormReturn<T | any, any, T>;
}) => {
	const onSubmit = useCallback((value: T) => {
		console.log(value, "values?");
	}, []);
	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
			<div className="w-full mb-6">
				<Label htmlFor="firstName">First name</Label>
				<Input
					{...form.register("firstName", { required: true })}
					type="text"
					className="w-full mt-2"
				/>
				<Error control={form.control} name="firstName" />
			</div>
			<div className="w-full mb-6">
				<Label htmlFor="lastName">Last name</Label>
				<Input
					{...form.register("lastName", { required: true })}
					type="text"
					className="w-full mt-2"
				/>
				<Error control={form.control} name="lastName" />
			</div>
			<div className="w-full mb-6">
				<Label htmlFor="username">Username</Label>
				<Input
					{...form.register("username", { required: true })}
					type="text"
					className="w-full mt-2"
				/>
				<span className="text-sm text-muted-foreground block">
					This is your public display name. It can be your real name or a
					pseudonym. You can only change this once every 30 days.
				</span>
				<Error control={form.control} name="username" />
			</div>
			<div className="w-full">
				<Label htmlFor="email">Email</Label>
				<Select
					{...form.register("email", { required: true })}
					onValueChange={(value) => {
						form.setValue("email", value);
						form.trigger("email");
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select a verified email to display" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="abc@g.com">abc@g.com</SelectItem>
						<SelectItem value="abc1@g.com">abc@g.com</SelectItem>
					</SelectContent>
				</Select>
				<Error control={form.control} name="email" />
			</div>
			<div className="w-full mb-6">
				<Label htmlFor="phone">Phone</Label>
				<Input
					{...form.register("phone", {
						required: true,
					})}
					type="text"
					className="w-full mt-2"
				/>
				<Error control={form.control} name="username" />
			</div>
			<div className="w-full">
				<Label htmlFor="bio">Bio</Label>
				<Textarea
					{...form.register("bio", { required: true })}
					className="w-full mt-2"
				/>
				<Error control={form.control} name="bio" />
			</div>
			<Button type="submit" className="bg-purple-500">
				Update Profile
			</Button>
		</form>
	);
};
