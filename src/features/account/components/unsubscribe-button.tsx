import toast from "react-hot-toast";
import { useState } from "react";
import api from "@/api";
import {
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UnsubscribeButton = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleUnsubscribe = async () => {
		try {
			await api.payment.cancelSubscription();
			toast.success("Unsubscribed successfully");
		} catch (error) {
			console.error("Failed to unsubscribe:", error);
			toast.error("Failed to unsubscribe");
		} finally {
			setDialogOpen(false);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger>
				<Button variant="destructive">Unsubscribe</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%]">
				<DialogHeader>
					<DialogTitle>Confirm Unsubscription</DialogTitle>
					<DialogDescription>
						<span>Are you sure you want to unsubscribe?</span>
						<div className="mt-2 flex flex-row justify-end gap-2">
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={handleUnsubscribe}>
								Confirm
							</Button>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default UnsubscribeButton;
