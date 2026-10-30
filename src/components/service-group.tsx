import { ServiceCard } from "#/components/service-card.tsx";
import { ItemGroup } from "#/components/ui/item.tsx";
import type { PreparedServiceCard } from "#/domain/services.ts";
import type { ServiceGroup } from "#/server/services.ts";

export const ServiceGroupContainer = ({
	group,
	list,
}: {
	group: ServiceGroup;
	list: PreparedServiceCard[];
}) => {
	return (
		<ItemGroup className="max-w-sm">
			<p className="mb-2 text-lg font-semibold">{group}</p>
			{list.map((s) => (
				<ServiceCard key={s.id} {...s} />
			))}
		</ItemGroup>
	);
};
