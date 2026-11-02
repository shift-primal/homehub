import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import type { Service } from "#/domain/services.ts";
import { checkSingleService, getServices } from "#/server/get-service.ts";

export const servicesQuery = queryOptions({
	queryKey: ["services"],
	queryFn: () => getServices(),
});

export function useRefreshService(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => checkSingleService({ data: id }),
		onSuccess: (updated) => {
			queryClient.setQueryData(servicesQuery.queryKey, (old) =>
				old?.map((s) => (s.id === id ? updated : s)),
			);
		},
		onError: (error) => {
			console.error(`Failed to refresh service ${id}:`, error);
		},
	});
}

export function groupServices(services: Service[]) {
	const groups = new Map<Service["group"], Service[]>();
	for (const s of services) {
		groups.set(s.group, [...(groups.get(s.group) ?? []), s]);
	}
	return [...groups].map(([group, list]) => ({ group, list }));
}
