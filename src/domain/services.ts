import type { ServiceStatus } from "#/server/get-service.ts";
import type { ServiceDef } from "#/server/services.ts";

export interface PreparedServiceCard {
	id: string;
	name: string;
	group: string;
	status: {
		iconName: "check" | "x" | "question";
		color: "green" | "red" | "gray";
		title: string;
		description: string;
	};
}

const STATUS_META: Record<
	ServiceStatus["state"],
	{
		iconName: PreparedServiceCard["status"]["iconName"];
		color: PreparedServiceCard["status"]["color"];
		title: string;
	}
> = {
	up: { iconName: "check", color: "green", title: "Service is up!" },
	down: { iconName: "x", color: "red", title: "Service is down" },
	skipped: { iconName: "question", color: "gray", title: "Skipped" },
};

export function prepareServiceCard(
	def: Omit<ServiceDef, "port" | "probe">,
	status: ServiceStatus,
): PreparedServiceCard {
	const state = status?.state || "skipped";
	const meta = STATUS_META[state];

	let description = "prod only";
	if (state === "up" && "ms" in status) {
		description = `up, ${status.ms} ms${status.version ? ` (${status.version})` : ""}`;
	} else if (state === "down" && "error" in status) {
		description = `down (${status.error})`;
	}

	return {
		id: def.id,
		name: def.name,
		group: def.group,
		status: { ...meta, description },
	};
}
