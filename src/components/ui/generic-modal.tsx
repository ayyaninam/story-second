import toast from "react-hot-toast";
import { ReactNode, useState } from "react";
import {
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const GenericModal = ({
	title,
	description,
	buttonText,
	confirmAction,
}: {
	title: string;
	description: string;
	buttonText: string | ReactNode;
	confirmAction: () => Promise<void>;
}) => {
	const [submitting, setSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button className="text-white bg-accent-600 hover:bg-accent-700">
					{buttonText}
				</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						<span>{description}</span>
						<div className="mt-2 flex flex-row justify-end gap-2">
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									setSubmitting(true);
									confirmAction()
										.then(() => {
											setDialogOpen(false);
											setSubmitting(false);
										})
										.catch((error) => {
											console.error("Failed to process", error);
											toast.error("Failed to process your request");
											setSubmitting(false);
										});
								}}
								disabled={submitting}
								className="text-white bg-accent-600 hover:bg-accent-700"
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

export default GenericModal;
