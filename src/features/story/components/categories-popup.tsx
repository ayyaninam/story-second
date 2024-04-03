import { CSSProperties, FC, useEffect, useState } from "react";
import { AmazonMarketplace } from "@/constants/amazon-constants";

import dynamic from "next/dynamic";

const EditCategoryView = dynamic(() =>
	import("./edit-categories").then((mod) => mod.EditCategoryView)
);
import Image from "next/image";

export const CategoriesPopup: FC<{
	showModal: boolean;
	setShowModal(val: boolean): void;
	categories: string[];
	saveCategories(newCategories: string[]): void;
	marketplace: AmazonMarketplace;
}> = ({ showModal, setShowModal, categories, marketplace, saveCategories }) => {
	const [internalCategories, setInternalCategories] = useState([...categories]);
	const [openIndex, setOpenIndex] = useState<number | undefined>(0);

	useEffect(() => {
		if (!showModal) return;
		setInternalCategories([...categories]);
		setOpenIndex(0);
	}, [showModal]);

	useEffect(() => {
		setInternalCategories([...categories]);
	}, [categories]);

	const deleteCategory = (i: number) => {
		const arr = [...internalCategories];
		arr.splice(i, 1);
		setInternalCategories(arr);
	};

	const setCategory = (c: string, i: number) => {
		let arr = [...internalCategories];
		arr[i] = c;
		setInternalCategories(arr);
	};

	const addCategory = () => {
		const arrayPlusOne = [...internalCategories, ""];
		setInternalCategories(arrayPlusOne);
		setOpenIndex(arrayPlusOne.length - 1);
	};

	const saveCategoriesHandler = () => {
		saveCategories(internalCategories);
		setShowModal(false);
	};

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			className="fixed grid place-items-center overflow-y-auto p-4 inset-0 z-40"
			style={
				{
					pointerEvents: showModal ? "auto" : "none",
				} as CSSProperties
			}
		>
			<div
				className={`fixed flex-grow inset-0 bg-black h-full transition-opacity duration-300 ${showModal ? "opacity-60" : "opacity-0"}`}
				onClick={() => setShowModal(false)}
			/>
			<div
				className={`flex flex-col bg-background rounded-2xl transform transition-opacity duration-300 p-8 translate-y-0 gap-2 w-full max-w-4xl ${showModal ? "opacity-1" : "opacity-0"}`}
			>
				<div className="flex items-center justify-between gap-4 mb-2">
					<h3 className="font-aleo font-bold text-2xl sm:text-3xl">
						Edit Category
					</h3>
					<button onClick={() => setShowModal(false)}>
						<Image src="/assets/icons/x.svg" alt="" height={24} width={24} />
					</button>
				</div>

				{internalCategories.map((c, i) => (
					<EditCategoryView
						key={`category-view-${i}`}
						deleteCategory={
							internalCategories.length > 1 ? () => deleteCategory(i) : null
						}
						category={c.split(" > ")}
						open={() => setOpenIndex(i)}
						isOpen={openIndex === i}
						close={() => setOpenIndex(undefined)}
						resetCategory={() => setCategory(categories[i] || "", i)}
						setCategory={(c: string) => setCategory(c, i)}
						marketplace={marketplace}
					/>
				))}

				<div className="w-full justify-items-end mt-3 flex-wrap flex flex-row-reverse items-center gap-x-4">
					<button className="btn-primary" onClick={saveCategoriesHandler}>
						Save Category
					</button>
					<button onClick={() => setShowModal(false)} className="btn-secondary">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
