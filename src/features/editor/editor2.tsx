import React, { useEffect, useState, useRef } from "react";

// const initialData = [
// 	{
// 		value: "this is segment one! ",
// 		id: 0,
// 	},
// 	{
// 		value: "this is segment two! ",
// 		id: 1,
// 	},
// 	{
// 		value: "this is segment three! ",
// 		id: 2,
// 	},
// 	{
// 		value: "this is segment four! ",
// 		id: 3,
// 	},
// 	{
// 		value: "this is segment five! ",
// 		id: 4,
// 	},
// 	{
// 		value: "this is segment six! ",
// 		id: 5,
// 	},
// 	{
// 		value: "this is segment seven! ",
// 		id: 6,
// 	},
// 	{
// 		value: "this is segment eight! ",
// 		id: 7,
// 	},
// 	{
// 		value: "this is segment nine! ",
// 		id: 8,
// 	},
// 	{
// 		value: "this is segment ten! ",
// 		id: 9,
// 	},
// ];

// type Data = { value: string; id: number };
// const getDiff = (initialData: Data[], currentData: Data[]) => {
// 	let edits: Data[] = [];
// 	let additions: Data[] = [];
// 	let subtractions: Data[] = [];

// 	// Grouping segments by id while maintaining order
// 	const initialDataMap = new Map<number, Data[]>();
// 	const currentDataMap = new Map<number, Data[]>();

// 	initialData.forEach((el) => {
// 		if (initialDataMap.has(el.id)) {
// 			initialDataMap.get(el.id)?.push(el);
// 		} else {
// 			initialDataMap.set(el.id, [el]);
// 		}
// 	});

// 	currentData.forEach((el) => {
// 		if (currentDataMap.has(el.id)) {
// 			currentDataMap.get(el.id)?.push(el);
// 		} else {
// 			currentDataMap.set(el.id, [el]);
// 		}
// 	});

// 	Array.from(
// 		new Set([...initialDataMap.keys(), ...currentDataMap.keys()])
// 	).forEach((el) => {
// 		if (initialDataMap.has(el) && currentDataMap.has(el)) {
// 			const initialSegments = initialDataMap.get(el)!;
// 			const currentSegments = currentDataMap.get(el)!;

// 			if (
// 				currentSegments[0] &&
// 				initialSegments[0]?.value !== currentSegments[0]?.value
// 			) {
// 				edits.push(currentSegments[0]); // if initial value is not equal the new value, then it's an edit
// 			}
// 			if (currentSegments.length > 1) {
// 				additions.push(...currentSegments.slice(1)); // any additional segments with the same ids are considered additions
// 			}
// 		} else if (!initialDataMap.has(el)) {
// 			additions.push(...currentDataMap.get(el)); // if the id is not in the initial data, then it's an addition
// 		} else if (!currentDataMap.has(el)) {
// 			subtractions.push(...initialDataMap.get(el)); // if the id is not in the current data, then it's a subtraction
// 		}
// 	});

// 	return { edits, additions, subtractions };
// };

// const Editor2 = () => {
// 	const [data, setData] = useState(initialData);
// 	useEffect(() => {
// 		console.log(getDiff(initialData, data));
// 	}, [data]);

// 	return (
// 		<>
// 			{data.map((item, index) => (
// 				<div key={index} className="space-x-1">
// 					<span>({item.id})</span>
// 					<input
// 						onChange={(e) =>
// 							setData((prev) => [
// 								...prev.slice(0, index),
// 								{ id: item.id, value: e.target.value },
// 								...prev.slice(index + 1),
// 							])
// 						}
// 						value={item.value}
// 					/>
// 					<button
// 						onClick={(e) =>
// 							setData((prev) => [
// 								...prev.slice(0, index + 1),
// 								{ id: item.id, value: "" },
// 								...prev.slice(index + 1),
// 							])
// 						}
// 					>
// 						+
// 					</button>
// 					<button
// 						onClick={(e) =>
// 							setData((prev) => [
// 								...prev.slice(0, index),
// 								...prev.slice(index + 1),
// 							])
// 						}
// 					>
// 						-
// 					</button>
// 				</div>
// 			))}
// 			<hr />
// 			<div>
// 				<h2>Edits</h2>
// 				{getDiff(initialData, data).edits.map((item, index) => (
// 					<div>
// 						id:{item.id}, val: {item.value}
// 					</div>
// 				))}
// 			</div>
// 			<hr />
// 			<div>
// 				<h2>Additions</h2>
// 				{getDiff(initialData, data).additions.map((item, index) => (
// 					<div>
// 						id:{item.id}, val: {item.value}
// 					</div>
// 				))}
// 			</div>
// 			<hr />
// 			<div>
// 				<h2>Subtractions</h2>
// 				{getDiff(initialData, data).subtractions.map((item, index) => (
// 					<div>
// 						id:{item.id}, val: {item.value}
// 					</div>
// 				))}
// 			</div>
// 		</>
// 	);
// };

const EditComponent = () => {
	// Initialize with an array of objects, each object holds a value and a ref
	const [inputs, setInputs] = useState(() =>
		["Hi"].map((text) => ({
			value: text,
			ref: React.createRef<HTMLInputElement>(),
		}))
	);

	// Focus logic based on text length and active element
	useEffect(() => {
		inputs.forEach((input, index) => {
			if (
				((input.value.length > 20 &&
					[",", " ", ".", ":", ";"].includes(input.value.slice(-1))) ||
					input.value.length > 30) &&
				document.activeElement === input.ref.current
			) {
				const nextInput = inputs[index + 1];
				if (nextInput && nextInput.ref.current) {
					nextInput.ref.current.focus();
				}
			}
		});
	}, [inputs]);

	const inputValues = inputs.map((input) => input.value);

	// Function to update the value of an input and possibly add or remove inputs
	const handleChange = (index: number, newValue: string) => {
		setInputs((prev) => {
			const updatedInputs = [...prev];
			updatedInputs[index].value = newValue;

			if (index === prev.length - 1 && newValue.length > 20) {
				updatedInputs.push({
					value: "",
					ref: React.createRef<HTMLInputElement>(),
					mirrorRef: React.createRef<HTMLSpanElement>(),
				});
			}

			return updatedInputs;
		});
	};

	const handleKeyDown = (
		index: number,
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		// Check for backspace or delete key when the input field is empty
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			inputs[index].value === ""
		) {
			event.preventDefault(); // Prevent the default action to avoid deleting the character

			// Delete the current input field and focus the end of the previous one, if it exists
			setInputs((prev) => {
				if (prev.length > 1 && index > 0) {
					const updatedInputs = prev.filter((_, i) => i !== index);
					setTimeout(() => {
						const prevInput = updatedInputs[index - 1].ref.current;
						if (prevInput) {
							prevInput.focus();
							// Set the cursor to the end of the previous input field
							const valLength = prevInput.value.length;
							prevInput.setSelectionRange(valLength, valLength);
						}
					}, 0);
					return updatedInputs;
				}
				return prev;
			});
		}
	};

	return (
		<div>
			{inputs.map((input, index) => (
				<React.Fragment key={index}>
					<input
						key={index}
						ref={input.ref}
						// width={input.mirrorRef.current?.offsetWidth}
						value={input.value}
						type="text"
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						className="outline-none hover:bg-purple-200 focus:text-purple-800 rounded-md"
					/>
					{/* <span
						ref={input.mirrorRef}
						className="absolute top-0 left-0whitespace-pre z-[-100] opacity-0 "
						style={{ display: "invisible" }}
					>
						{input.value || " "}
					</span> */}
				</React.Fragment>
			))}
		</div>
	);
};

export default EditComponent;
