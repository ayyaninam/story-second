import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeletedSuceededDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const DeletedSuceededDialog = ({
	open,
	setOpen,
}: DeletedSuceededDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Video deleted successfully!</DialogTitle>
					<DialogDescription>
						Your video was successfully deleted and removed from the Story.com
						library.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeletedSuceededDialog;
