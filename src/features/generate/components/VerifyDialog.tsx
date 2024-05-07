import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React, { useState, SetStateAction, Dispatch } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface VerifyDialogProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const VerifyDialog = ({ open, setOpen }: VerifyDialogProps) => {
	const [loading, setLoading] = useState(false);

	const resendVerificationEmail = async () => {
		setLoading(true);
		try {
			const response = await api.user.resendEmailVerification();
			console.log(response);
			toast.success("Verification email sent!");
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Verify Your Email To Continue</DialogTitle>
					<DialogDescription>
						Please verify your email to generate a story.
						<p className="my-2">
							Didn&apos;t receive an email? Click the button below to resend the
							verification email.
						</p>
					</DialogDescription>
					<div className="flex justify-center gap-2 mt-8 w-full">
						<Button
							className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit"
							variant="default"
							onClick={resendVerificationEmail}
							disabled={loading}
						>
							Resend my verification email
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default VerifyDialog;
