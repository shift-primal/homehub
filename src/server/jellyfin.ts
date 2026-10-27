import { createServerFn } from "@tanstack/react-start";

export type ServiceStatus =
	| { up: true; name: string; version: string }
	| { up: false; error: string };

// Runs on the server only: the browser never sees JELLYFIN_URL (or, later, an API key).
// In the container, JELLYFIN_URL points at the host (homelab.apps in shift-primal/nixos).
export const getJellyfinStatus = createServerFn().handler(
	async (): Promise<ServiceStatus> => {
		const base = process.env.JELLYFIN_URL ?? "http://localhost:8096";
		try {
			// Public endpoint, no API key needed.
			const res = await fetch(`${base}/System/Info/Public`, {
				signal: AbortSignal.timeout(3000),
			});
			if (!res.ok) return { up: false, error: `HTTP ${res.status}` };
			const info = (await res.json()) as {
				ServerName: string;
				Version: string;
			};
			return { up: true, name: info.ServerName, version: info.Version };
		} catch (e) {
			return { up: false, error: e instanceof Error ? e.message : String(e) };
		}
	},
);
