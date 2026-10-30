import grontLys from "#/assets/icons/apps/grontlys.svg";
import haugestol from "#/assets/icons/apps/haugestol.svg";
import pokemon from "#/assets/icons/apps/pokemon.ico";
import spot from "#/assets/icons/apps/spot.svg";
import ws from "#/assets/icons/apps/ws.svg";
import bazarr from "#/assets/icons/dashboard/bazarr.svg";
import discord from "#/assets/icons/dashboard/discord.svg";
import flaresolverr from "#/assets/icons/dashboard/flaresolverr.svg";
import immich from "#/assets/icons/dashboard/immich.svg";
import jellyfin from "#/assets/icons/dashboard/jellyfin.svg";
import openCloud from "#/assets/icons/dashboard/open-cloud.svg";
import pocketId from "#/assets/icons/dashboard/pocket-id.svg";
import prowlarr from "#/assets/icons/dashboard/prowlarr.svg";
import radarr from "#/assets/icons/dashboard/radarr.svg";
import seerr from "#/assets/icons/dashboard/seerr.svg";
import sonarr from "#/assets/icons/dashboard/sonarr.svg";
import aiostreams from "#/assets/icons/selfhst/aiostreams.svg";
import decypharr from "#/assets/icons/selfhst/decypharr.png";
import komodo from "#/assets/icons/selfhst/komodo.svg";

export const icons: Partial<Record<string, string>> = {
	// Media
	jellyfin,
	seerr,
	sonarr,
	radarr,
	prowlarr,
	bazarr,
	decypharr,
	aiostreams,
	flaresolverr,

	// Homelab
	komodo,
	immich,
	opencloud: openCloud,
	"pocket-id": pocketId,

	// Apps
	haugestol,
	pokemon,
	spot,
	ws,
	klyndre: discord,
	"gront-lys-staging": grontLys,
	"gront-lys": grontLys,
};
