"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
	username: z
		.string({ required_error: "Username is required" })
		.min(1, "Please enter username"),
	email: z
		.string({ required_error: "Email is required" })
		.email("Invalid email"),
	bio: z.string({ required_error: "Bio is required" }).min(100).max(1500),
	urls: z.array(z.string().url("Invalid URL")),
});

type Profile = z.infer<typeof profileSchema>;

const Profile = () => {
	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			username: "abc",
			bio: "etetetet",
			email: "",
			urls: [],
		},
	});

	const onSubmit = useCallback((value: Profile) => {
		console.log(value, "values?");
	}, []);

	return (
		<div className="max-w-full min-h-screen bg-background p-14">
			<p className="text-3xl font-bold">Settings</p>
			<p className="text-base font-extralight text-muted-foreground">
				Manage your account settings and set e-mail preferences.
			</p>
			<hr className="mt-8" />
			<div className="flex">
				<div className="w-2/12">
					<ToggleGroup type="single" className="flex flex-col space-y-2 mt-5">
						<ToggleGroupItem value="a" className="w-full justify-start">
							Profile
						</ToggleGroupItem>
						<ToggleGroupItem value="b" className="w-full justify-start">
							Amazon Status
						</ToggleGroupItem>
						<ToggleGroupItem value="c" className="w-full justify-start">
							My Items
						</ToggleGroupItem>
						<ToggleGroupItem value="c" className="w-full justify-start">
							Payouts
						</ToggleGroupItem>
						<ToggleGroupItem value="c" className="w-full justify-start">
							Payment Details
						</ToggleGroupItem>
						<ToggleGroupItem value="c" className="w-full justify-start">
							Wallets
						</ToggleGroupItem>
						<ToggleGroupItem value="c" className="w-full justify-start">
							Preferences
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<div id="tab-section" className="ml-28 w-4/6">
					<div className="py-8">
						<p className="text-2xl font-bold">Profile</p>
						<p className="text-base font-extralight text-muted-foreground">
							This is how others will see you on the site.
						</p>
						<Separator className="my-8" />
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
							<div className="w-full">
								<Label htmlFor="picture">Username</Label>
								<Input
									{...form.register("username", { required: true })}
									type="text"
									className="w-full mt-2"
								/>
							</div>
							<div className="w-full">
								<Label htmlFor="picture">Email</Label>
								<Select {...form.register("email", { required: true })}>
									<SelectTrigger>
										<SelectValue placeholder="Select a verified email to display" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="abc">abc@g.com</SelectItem>
										<SelectItem value="bac">abc@g.com</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="w-full">
								<Label htmlFor="picture">Bio</Label>
								<Textarea
									{...form.register("bio", { required: true })}
									className="w-full mt-2"
								/>
							</div>
							<div className="w-full">
								<Label htmlFor="picture">Username</Label>
								<Input id="picture" type="text" className="w-full mt-2" />
							</div>

							<Button className="bg-purple-500 mt-6">Update Profile</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
