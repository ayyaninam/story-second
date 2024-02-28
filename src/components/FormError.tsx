import { get } from "lodash";
import { Control, useFormState } from "react-hook-form";

const Error = ({
	name,
	control,
}: {
	name: string;
	control: Control<any, any>;
}) => {
	const { errors } = useFormState({ control: control });
	const fieldError = get(errors, name, "");
	if (!fieldError) {
		return null;
	}
	return (
		<span className="text-sm text-destructive">
			{fieldError.message?.toString()}
		</span>
	);
};

export default Error;
