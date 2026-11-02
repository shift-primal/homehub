import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { BeszelGroup } from "#/components/beszel-card.tsx";
import { ServiceGroupContainer } from "#/components/service-group.tsx";
import { groupServices, servicesQuery } from "#/hooks/use-services.ts";
import { getBeszel } from "#/server/beszel.ts";

export const Route = createFileRoute("/")({
	loader: async ({ context }) => {
		const [, beszel] = await Promise.all([
			context.queryClient.query({ ...servicesQuery, staleTime: "static" }),
			getBeszel(),
		]);
		return { beszel };
	},
	component: Home,
});

function Home() {
	const { beszel } = Route.useLoaderData();
	const { data: services } = useSuspenseQuery(servicesQuery);
	const groups = groupServices(services);

	return (
		<div className="space-y-6 p-8">
			<h1 className="text-4xl font-bold">homehub</h1>
			<div className="flex flex-wrap gap-8">
				<BeszelGroup initial={beszel} />
				{groups.map(({ group, list }) => (
					<ServiceGroupContainer key={group} group={group} list={list} />
				))}
			</div>
		</div>
	);
}
