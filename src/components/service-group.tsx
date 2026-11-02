import { ServiceCard } from "#/components/service-card.tsx";
import { ItemGroup } from "#/components/ui/item.tsx";
import type { Service, ServiceGroup } from "#/domain/services.ts";

export const ServiceGroupContainer = ({
	group,
	list,
}: {
	group: ServiceGroup;
	list: Service[];
}) => {
	return (
		<ItemGroup>
			<p className="mb-2 text-lg font-semibold">{group}</p>
			<div className="flex flex-wrap gap-2">
				{list.map((s) => (
					<ServiceCard key={s.id} service={s} />
				))}
			</div>
		</ItemGroup>
	);
};
