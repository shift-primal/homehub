import { createFileRoute } from "@tanstack/react-router";

import { getJellyfinStatus } from "#/server/jellyfin";

export const Route = createFileRoute("/")({
	loader: () => getJellyfinStatus(),
	component: Home,
});

function Home() {
	const jellyfin = Route.useLoaderData();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">homehub</h1>
			<ul className="mt-6">
				<li>
					Jellyfin:{" "}
					{jellyfin.up
						? `up (${jellyfin.name} ${jellyfin.version})`
						: `down (${jellyfin.error})`}
				</li>
			</ul>
		</div>
	);
}
