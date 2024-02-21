import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { mainSchema } from "@/api/schema";
import api from "@/api";

const getCardNumberString = (last4?: string) => {
	if (!last4) return "No saved card";
	return `•••• •••• •••• ${last4}`;
};

const getCardExpiryDate = ({
	cardExpiryMonth,
	cardExpiryYear,
	format,
}: {
	cardExpiryMonth: number;
	cardExpiryYear: number;
	format?: string;
}) => {
	return dayjs()
		.month(cardExpiryMonth - 1)
		.year(cardExpiryYear)
		.format(format || "MM/YYYY");
};

export const getUserHasCard = (user: mainSchema["UserInfoDTO"] | undefined) => {
	if (!user) return false;
	return (
		user.cardBrand &&
		user.cardLast4 &&
		user.cardExpiryMonth != null &&
		user.cardExpiryYear != null
	);
};

export default function PaymentCard({
	editable,
	onEdit,
	onRemove,
}: {
	editable?: boolean;
	onEdit: () => void;
	onRemove: () => void;
}) {
	// todo: refactor into something like "const [user] = useGetUser();"
	const [user, setUser] = useState<mainSchema["UserInfoDTO"] | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		(async () => {
			const user = await api.user.get();
			if (user.data) {
				setUser(user.data);
			}
		})();
	}, []);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleRemoveCard = async () => {
		try {
			await api.payment.removeCard();
			toast.success("Remove card successfully");
			toggleModal();
			onRemove();
		} catch (error) {
			console.error("Failed to remove card:", error);
			toast.error("Failed to remove card");
		}
	};

	if (!user || !getUserHasCard(user)) return null;

	return (
		<div className="flex p-5 gap-2 justify-between items-center min-w-max w-full max-w-sm bg-[#EDD8B1] rounded-2xl">
			<div className="flex flex-col">
				<div className="flex items-center gap-4">
					<p className="font-semibold text-xl capitalize">
						{user.cardBrand?.toString().replace(/_/g, " ")}
					</p>
					<p className="text-xs">
						Exp.{" "}
						{getCardExpiryDate({
							cardExpiryMonth: user.cardExpiryMonth!,
							cardExpiryYear: user.cardExpiryYear!,
						})}
					</p>
				</div>
				<p>{getCardNumberString(user.cardLast4!)}</p>
			</div>

			{editable ? (
				<div className="flex gap-2">
					<button onClick={() => onEdit()}>✏️</button>
					<button onClick={() => toggleModal()}>X</button>
				</div>
			) : null}

			{isModalOpen && (
				<div className="fixed grid place-items-center overflow-y-auto p-4 inset-0 z-40">
					<div
						className="fixed flex-grow inset-0 bg-black opacity-60 h-full transition-opacity duration-300"
						onClick={toggleModal}
					></div>
					<div className="flex flex-col bg-background rounded-2xl transform transition-opacity duration-300 p-8 opacity-1 translate-y-0">
						<h4>Confirm Removal</h4>
						<p>Are you sure you want to remove this card?</p>
						<div className="flex justify-between mt-5">
							<button
								className="bg-[#ccc] text-[#333] py-2 px-4 border-none rounded-md cursor-pointer transition-colors duration-200"
								onClick={toggleModal}
							>
								Cancel
							</button>
							<button
								className="bg-[#e74c3c] text-[#fff] py-2 px-4 border-none rounded-md cursor-pointer transition-colors duration-200"
								onClick={handleRemoveCard}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
