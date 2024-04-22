import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useUpdateUser from "@/hooks/useUpdateUser";

export default function RoyaltiesPayoutDialog({
	canWithdraw,
	withdrawFunds,
}: {
	canWithdraw: boolean | number;
	withdrawFunds: any;
}) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const { invalidateUser } = useUpdateUser();

	const handleConfirmClick = async () => {
		// Assuming canWithdraw is a state or comes from props/context
		if (!canWithdraw) return;
		setSubmitting(true);
		try {
			// Assuming withdrawFunds.mutateAsync() is the actual call to process the withdrawal
			await withdrawFunds.mutateAsync().then(() => {
				toast.success(
					"Your funds are being processed for withdrawal. Please allow 5-7 business days for the funds to be deposited into your bank account.",
					{ duration: 12000 }
				);
			});
		} catch (error) {
			toast.error("Something went wrong. Please try again later.", {
				duration: 12000,
			});
		} finally {
			setSubmitting(false);
			setDialogOpen(false);
			invalidateUser();
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="text-white bg-pink-700 hover:bg-pink-800">
					Withdraw Royalties
				</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%] translate-x-[-50%] top-1/4 fixed">
				<DialogHeader>
					<DialogTitle>Withdraw Royalties</DialogTitle>
					<DialogDescription>
						<p>
							You&apos;re all set to withdraw your royalties! This is a
							significant milestone in your journey as an author. Click
							&quot;Confirm&quot; to proceed with the payout process. We&apos;ll
							review your request and get back to you shortly.
						</p>
						<div className="mt-2 flex flex-row justify-end gap-2">
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleConfirmClick}
								disabled={submitting}
								className="text-white bg-pink-700 hover:bg-pink-800"
							>
								Confirm
							</Button>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
