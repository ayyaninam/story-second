import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";

const VerifyDialog = () => {
	const [open, setOpen] = useState(false);

	const { data } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
	});

	useEffect(() => {
		if (data && !data?.data?.emailVerified) {
			setTimeout(() => {
				setOpen(true);
			}, 1000);
		}
	}, [data]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Verify Your Email</DialogTitle>
					<DialogDescription>
						Please verify your email. This verification is necessary in order to
						generate a story. Check your inbox for a verification link.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default VerifyDialog;
