import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ServiceGroupContainer } from "#/components/service-group.tsx";
import { getServices } from "#/server/get-service.ts";
import type { ServiceGroup } from "#/server/services.ts";

export const Route = createFileRoute("/")({
	loader: () => getServices(),
	component: Home,
});

function Home() {
	const initialServices = Route.useLoaderData();

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

	return (
		<div className="space-y-6 p-8">
			<h1 className="text-4xl font-bold">homehub</h1>
			<div className="flex flex-wrap gap-8">
				{groups.map(({ group, list }) => (
					<ServiceGroupContainer key={group} group={group} list={list} />
				))}
			</div>
		</div>
	);
}
