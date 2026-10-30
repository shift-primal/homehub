export type Probe = "jellyfin" | "seerr" | "arr" | "http";

export type ServiceGroup = "Media" | "Homelab" | "Apps";

export type ServiceDef = {
	id: string;
	name: string;
	group: ServiceGroup;
	port: number;
	href?: string;
	tailnet?: true;
	probe: Probe;
};

export const serviceDefs: ServiceDef[] = [
	{
		id: "jellyfin",
		name: "Jellyfin",
		group: "Media",
		port: 8096,
		href: "http://snyltflix.local",
		probe: "jellyfin",
	},
	{
		id: "aiostreams",
		name: "AIOStreams",
		group: "Media",
		port: 3000,
		probe: "http",
	},

	// Homelab services
	{
		id: "komodo",
		name: "Komodo",
		group: "Homelab",
		port: 9120,
		href: "https://komodo.haugestol.com",
		probe: "http",
	},
	{
		id: "immich",
		name: "Immich",
		group: "Homelab",
		port: 2283,
		href: "https://photos.haugestol.com",
		probe: "http",
	},
	{
		id: "opencloud",
		name: "OpenCloud",
		group: "Homelab",
		port: 9200,
		href: "https://drive.haugestol.com",
		probe: "http",
	},
	{
		id: "pocket-id",
		name: "Pocket ID",
		group: "Homelab",
		port: 1411,
		href: "https://id.haugestol.com",
		probe: "http",
	},

	// Web apps
	{
		id: "haugestol",
		name: "haugestol.com",
		group: "Apps",
		port: 3004,
		href: "https://haugestol.com",
		probe: "http",
	},
	{
		id: "pokemon",
		name: "Pokédex",
		group: "Apps",
		port: 3001,
		href: "https://pokemon.haugestol.com",
		probe: "http",
	},
	{
		id: "spot",
		name: "Spot",
		group: "Apps",
		port: 3003,
		href: "https://spot.haugestol.com",
		probe: "http",
	},
	{
		id: "ws",
		name: "Wastescope",
		group: "Apps",
		port: 3005,
		href: "https://ws.haugestol.com",
		probe: "http",
	},
	{
		id: "klyndre",
		name: "Klyndre",
		group: "Apps",
		port: 3006,
		href: "https://klyndre.haugestol.com",
		probe: "http",
	},
	{
		id: "gront-lys-staging",
		name: "Grønt Lys (staging)",
		group: "Apps",
		port: 3007,
		href: "https://staging-grontlys.haugestol.com",
		probe: "http",
	},
	{
		id: "gront-lys",
		name: "Grønt Lys",
		group: "Apps",
		port: 3008,
		href: "https://grontlys.haugestol.com",
		probe: "http",
	},
];
