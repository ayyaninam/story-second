import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
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
import Routes from "@/routes";

interface DeleteStorybookButtonProps {
	storyId: string;
}

const DeleteStorybookButton = ({ storyId }: DeleteStorybookButtonProps) => {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDelete = async () => {
		setSubmitting(true);
		try {
			await api.webstory.deleteStory({ id: storyId });
			toast.success("Storybook deleted successfully");
			await router.replace(`${Routes.Library()}?deleteSucceeded=true`);
		} catch (error) {
			console.error("Failed to delete: ", error);
			toast.error("Failed to delete");
		} finally {
			setDialogOpen(false);
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					className="px-4 py-1.5 text-background text-white text-sm font-medium flex gap-2 items-center h-fit"
					variant="destructive"
				>
					<Trash2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%]">
				<DialogHeader>
					<DialogTitle>Confirm Delete Storybook</DialogTitle>
					<DialogDescription>
						<span>Are you sure you want to delete the storybook?</span>
						<div className="mt-2 flex flex-row justify-end gap-2">
							<Button variant="secondary" onClick={() => setDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleDelete}
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
};

export default DeleteStorybookButton;
