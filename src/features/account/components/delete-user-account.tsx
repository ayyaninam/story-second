import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import api from "@/api";
import Router from "next/router";
import Routes from "@/routes";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const DeleteAccountDialog = ({
	dialogOpen,
	setDialogOpen,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
}) => {
	const [submitting, setSubmitting] = useState(false);

	const handleDeleteAccount = async () => {
		setSubmitting(true);
		try {
			await api.user.deleteAccount();
			await Router.push(Routes.Logout());
		} catch (error) {
			toast.error("Failed to process your request");
		} finally {
			setSubmitting(false);
			setDialogOpen(false); // Close the dialog regardless of success or failure
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-red-600 hover:bg-red-700">Delete Account</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%]">
				<DialogHeader>
					<DialogTitle>Confirm Account Deletion</DialogTitle>
					<DialogDescription>
						<p>
							This action is irreversible and all your data will be lost. If
							you&apos;re on a subscription plan, it will be cancelled and
							you&apos;ll not be refunded. Please reach out to support if you
							require any assistance
						</p>
						<span>Are you sure you want to continue?</span>
						<div className="mt-2 flex flex-row justify-end gap-2">
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleDeleteAccount}
								disabled={submitting}
								className="text-white bg-red-600 hover:bg-red-700"
							>
								Confirm
							</Button>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteAccountDialog;
