export type ServiceGroup = "Media" | "Homelab" | "Apps";

export type ServiceStatus =
	| { state: "up"; ms: number; version?: string }
	| { state: "down"; error: string }
	| { state: "skipped" };

export type Service = {
	id: string;
	name: string;
	group: ServiceGroup;
	href?: string;
	status: ServiceStatus;
};
