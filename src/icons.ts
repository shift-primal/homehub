import grontLys from "#/assets/icons/apps/grontlys.svg";
import haugestol from "#/assets/icons/apps/haugestol.svg";
import pokemon from "#/assets/icons/apps/pokemon.ico";
import spot from "#/assets/icons/apps/spot.svg";
import ws from "#/assets/icons/apps/ws.svg";
import discord from "#/assets/icons/dashboard/discord.svg";
import immich from "#/assets/icons/dashboard/immich.svg";
import jellyfin from "#/assets/icons/dashboard/jellyfin.svg";
import openCloud from "#/assets/icons/dashboard/open-cloud.svg";
import pocketId from "#/assets/icons/dashboard/pocket-id.svg";
import aiostreams from "#/assets/icons/selfhst/aiostreams.svg";
import komodo from "#/assets/icons/selfhst/komodo.svg";

export const icons: Partial<Record<string, string>> = {
	// Media
	jellyfin,
	aiostreams,

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
