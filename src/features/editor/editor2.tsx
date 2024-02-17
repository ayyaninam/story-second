import React, { useEffect, useState, useRef } from "react";

const Editor2 = () => {
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

export default Editor2;

// import { useEffect, useRef, useState } from "react";

// const Editor2 = () => {
// 	const [value, setValue] = useState([
// 		"Hello, 1 ",
// 		"And this 2",
// 		"This is section 3",
// 	]);
// 	const refs = [useRef(null), useRef(null), useRef(null)];
// 	useEffect(() => {
// 		if (value[0].length > 20 && document.activeElement === refs[0]?.current) {
// 			refs[1]?.current.focus();
// 		} else if (
// 			value[1].length > 20 &&
// 			document.activeElement === refs[1]?.current
// 		) {
// 			refs[2]?.current.focus();
// 		} else if (
// 			value[2].length > 20 &&
// 			document.activeElement === refs[2]?.current
// 		) {
// 			console.log("value[2]", value[2]);
// 		}
// 	}, [value]);

// 	return (
// 		<div>
// 			<input
// 				ref={refs[0]}
// 				type="text"
// 				id="1"
// 				value={value[0]}
// 				onChange={(e) => setValue((prev) => [e.target.value, prev[1], prev[2]])}
// 			/>
// 			<input
// 				ref={refs[1]}
// 				type="text"
// 				id="2"
// 				value={value[1]}
// 				onChange={(e) => setValue((prev) => [prev[0], e.target.value, prev[2]])}
// 			/>
// 			<input
// 				ref={refs[2]}
// 				type="text"
// 				id="3"
// 				value={value[2]}
// 				onChange={(e) => setValue((prev) => [prev[0], prev[1], e.target.value])}
// 			/>
// 		</div>
// 	);
// };
// export default Editor2;
