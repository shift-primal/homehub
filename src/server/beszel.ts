import { createServerFn } from "@tanstack/react-start";

// Beszel's hub is PocketBase. homehub logs in as a read-only user that beszel-configure makes
// from BESZEL_EMAIL and the sops BESZEL_PASSWORD (homelab/ops/monitoring/beszel.nix in shift-primal/nixos).

export type BeszelSystem = {
	id: string;
	name: string;
	status: "up" | "down" | "paused" | "pending";
	cpu: number;
	mem: number;
	// "/" first, then the agent's extra filesystems (e.g. /mnt/data).
	disks: { name: string; pct: number }[];
	temp?: number;
	uptime: number;
	failedServices?: number;
};

export type BeszelResult =
	| { state: "ok"; systems: BeszelSystem[] }
	| { state: "error"; error: string }
	| { state: "skipped" };

// The agent's short JSON keys (internal/entities/system Info in henrygd/beszel).
type Info = {
	cpu?: number;
	mp?: number;
	dp?: number;
	dt?: number;
	u?: number;
	efs?: Record<string, number>;
	sv?: number[];
	rdn?: string;
};

type SystemRecord = {
	id: string;
	name: string;
	status: BeszelSystem["status"];
	info: Info | null;
};

const TIMEOUT_MS = 3000;

// Cached across requests. Dropped on a 401, e.g. after beszel-configure resets the password.
let token: string | undefined;

async function login(url: string): Promise<string> {
	const res = await fetch(`${url}/api/collections/users/auth-with-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			identity: process.env.BESZEL_EMAIL,
			password: process.env.BESZEL_PASSWORD,
		}),
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (!res.ok) throw new Error(`login: HTTP ${res.status}`);
	return ((await res.json()) as { token: string }).token;
}

async function listSystems(url: string): Promise<SystemRecord[]> {
	for (let attempt = 0; attempt < 2; attempt++) {
		token ??= await login(url);
		const res = await fetch(
			`${url}/api/collections/systems/records?sort=name&perPage=200&fields=id,name,status,info`,
			{
				headers: { Authorization: token },
				signal: AbortSignal.timeout(TIMEOUT_MS),
			},
		);
		if (!res.ok && res.status !== 401 && res.status !== 403) {
			throw new Error(`HTTP ${res.status}`);
		}
		// PocketBase treats a stale token as no login, which lists no systems instead of failing.
		const items = res.ok
			? ((await res.json()) as { items: SystemRecord[] }).items
			: [];
		if (items.length > 0) return items;
		token = undefined;
	}
	throw new Error("no systems shared with this account");
}

const round = (n: number | undefined) => Math.round((n ?? 0) * 10) / 10;

function toSystem({ id, name, status, info }: SystemRecord): BeszelSystem {
	const i = info ?? {};
	return {
		id,
		name,
		status,
		cpu: round(i.cpu),
		mem: round(i.mp),
		disks: [
			{ name: i.rdn || "/", pct: round(i.dp) },
			...Object.entries(i.efs ?? {}).map(([name, pct]) => ({
				name,
				pct: round(pct),
			})),
		],
		temp: i.dt ? Math.round(i.dt) : undefined,
		uptime: i.u ?? 0,
		failedServices: i.sv?.[1],
	};
}

export const getBeszel = createServerFn({ method: "GET" }).handler(
	async (): Promise<BeszelResult> => {
		const url = process.env.BESZEL_URL;
		if (!url || !process.env.BESZEL_EMAIL || !process.env.BESZEL_PASSWORD) {
			return { state: "skipped" };
		}
		try {
			return { state: "ok", systems: (await listSystems(url)).map(toSystem) };
		} catch (e) {
			const error =
				e instanceof Error
					? e.cause instanceof Error
						? e.cause.message
						: e.message
					: String(e);
			return { state: "error", error };
		}
	},
);
