import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { BeszelGroup } from "#/components/beszel-card.tsx";
import { ServiceGroupContainer } from "#/components/service-group.tsx";
import { getBeszel } from "#/server/beszel.ts";
import { getServices } from "#/server/get-service.ts";
import type { ServiceGroup } from "#/server/services.ts";

export const Route = createFileRoute("/")({
	loader: async () => {
		const [services, beszel] = await Promise.all([getServices(), getBeszel()]);
		return { services, beszel };
	},
import { groupServices, servicesQuery } from "#/hooks/use-services.ts";

export const Route = createFileRoute("/")({
	loader: ({ context }) =>
		context.queryClient.query({ ...servicesQuery, staleTime: "static" }),
	component: Home,
});

function Home() {
	const { services: initialServices, beszel } = Route.useLoaderData();

	const { data: services = [] } = useQuery({
		queryKey: ["services"],
		queryFn: () => getServices(),
		initialData: initialServices,
	});

	const uniqueGroups = [
		...new Set(services.map((s) => s.group as ServiceGroup)),
	];
	const groups = uniqueGroups.map((group) => ({
		group,
		list: services.filter((s) => s.group === group),
	}));
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
