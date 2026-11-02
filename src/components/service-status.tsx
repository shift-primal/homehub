import { cn } from "cn";
import { Check, CircleQuestionMark, X } from "lucide-react";

import { ItemDescription } from "#/components/ui/item.tsx";
import type { ServiceStatus as Status } from "#/domain/services.ts";

const STATUS_DISPLAY = {
	up: { Icon: Check, className: "text-success", title: "Service is up!" },
	down: { Icon: X, className: "text-destructive", title: "Service is down" },
	skipped: {
		Icon: CircleQuestionMark,
		className: "text-warning",
		title: "Skipped",
	},
} as const;

function describe(status: Status) {
	switch (status.state) {
		case "up":
			return `up, ${status.ms} ms${status.version ? ` (${status.version})` : ""}`;
		case "down":
			return `down (${status.error})`;
		case "skipped":
			return "prod only";
	}
}

export const ServiceStatus = ({ status }: { status: Status }) => {
	const { Icon, className, title } = STATUS_DISPLAY[status.state];

	return (
		<>
			<div className="flex items-center gap-2">
				<Icon className={cn("inline size-5", className)} />
				<span className="text-sm font-medium">{title}</span>
			</div>
			<ItemDescription className="text-muted-foreground pl-7 text-xs">
				{describe(status)}
			</ItemDescription>
		</>
	);
};
