"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
	value,
	onChange,
	className,
}: {
	value?: Date;
	onChange: (value?: Date) => void;
	className?: string;
}) {
	const [date, setDate] = React.useState<Date | undefined>();

	React.useEffect(() => {
		setDate(value);
	}, [value]);

	return (
		<Popover
			onOpenChange={(open) => {
				onChange?.(date);
			}}
		>
			<PopoverTrigger className={className} asChild>
				<Button
					variant={"outline"}
					className={cn(
						" justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
					captionLayout="dropdown"
					fromYear={1924}
					toYear={2006}
				/>
			</PopoverContent>
		</Popover>
	);
}
