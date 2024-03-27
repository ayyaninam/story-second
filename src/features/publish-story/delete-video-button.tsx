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

interface DeleteVideoButtonProps {
	storyId: string;
}

const DeleteVideoButton = ({ storyId }: DeleteVideoButtonProps) => {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDelete = async () => {
		setSubmitting(true);
		try {
			await api.webstory.deleteStory({ id: storyId });
			toast.success("Video deleted successfully");
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
					className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
					variant="outline"
				>
					<Trash2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="left-[50%]">
				<DialogHeader>
					<DialogTitle>Confirm Delete Video</DialogTitle>
					<DialogDescription>
						<span>Are you sure you want to delete the video?</span>
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

export default DeleteVideoButton;
