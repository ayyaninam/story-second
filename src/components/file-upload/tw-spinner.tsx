import React from "react";

interface TailwindSpinnerProps {
	style?: React.CSSProperties;
	className?: string;
}

export default function TailwindSpinner({
	style,
	className,
}: TailwindSpinnerProps) {
	return (
		<div className={`lds-ring ${className}`} style={style}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
