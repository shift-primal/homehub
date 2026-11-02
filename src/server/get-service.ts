import { createServerFn } from "@tanstack/react-start";

import type { Service, ServiceStatus } from "#/domain/services.ts";

import { type Probe, type ServiceDef, serviceDefs } from "./services";

const TIMEOUT_MS = 3000;

async function get(url: string): Promise<Response> {
	const res = await fetch(url, {
		redirect: "manual",
		signal: AbortSignal.timeout(TIMEOUT_MS),
	});
	if (res.status >= 500) throw new Error(`HTTP ${res.status}`);
	return res;
}

async function json<T>(url: string): Promise<T> {
	const res = await get(url);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return (await res.json()) as T;
}

const probes: Record<Probe, (base: string) => Promise<string | undefined>> = {
	jellyfin: async (base) =>
		(await json<{ Version: string }>(`${base}/System/Info/Public`)).Version,
	seerr: async (base) =>
		(await json<{ version: string }>(`${base}/api/v1/status`)).version,
	arr: async (base) => {
		await json(`${base}/ping`);
		return undefined;
	},
	http: async (base) => {
		await get(base);
		return undefined;
	},
};

async function check(def: ServiceDef): Promise<ServiceStatus> {
	const prod = process.env.APP_ENV === "prod";
	const base = prod ? `http://127.0.0.1:${def.port}` : def.href;
	if (!base) return { state: "skipped" };
	const start = performance.now();
	try {
		const version = await probes[def.probe](base);
		return { state: "up", ms: Math.round(performance.now() - start), version };
	} catch (e) {
		const error =
			e instanceof Error
				? e.cause instanceof Error
					? e.cause.message
					: e.message
				: String(e);
		return { state: "down", error };
	}
}

async function checkDef(def: ServiceDef): Promise<Service> {
	const { port: _, probe: __, tailnet: ___, ...service } = def;
	return { ...service, status: await check(def) };
}

export const getServices = createServerFn({ method: "GET" }).handler(
	(): Promise<Service[]> => Promise.all(serviceDefs.map(checkDef)),
);

export const checkSingleService = createServerFn({ method: "POST" })
	.validator((id: string) => id)
	.handler(({ data: id }): Promise<Service> => {
		const def = serviceDefs.find((d) => d.id === id);
		if (!def) throw new Error(`Service with ID "${id}" not found.`);
		return checkDef(def);
	});
