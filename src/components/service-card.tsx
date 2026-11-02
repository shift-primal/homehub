import { cn } from "cn";
import { RefreshCw } from "lucide-react";

import { ServiceStatus } from "#/components/service-status.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Item,
	ItemActions,
	ItemFooter,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "#/components/ui/item.tsx";
import type { Service } from "#/domain/services.ts";
import { useRefreshService } from "#/hooks/use-services.ts";
import { icons } from "#/icons.ts";

export const ServiceCard = ({ service }: { service: Service }) => {
	const { id, name, href, status } = service;
	const brandIcon = icons[id];
	const { mutate: refresh, isPending } = useRefreshService(id);

	return (
		<Item
			variant="outline"
			className={cn(
				"relative max-w-sm",
				href && "has-[a:hover]:bg-muted",
				isPending && "opacity-70 transition-opacity",
			)}
		>
			<ItemHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					<ItemMedia>
						{brandIcon && (
							<img
								src={brandIcon}
								alt={`${name} icon`}
								className="inline size-8 object-contain"
							/>
						)}
					</ItemMedia>
					<ItemTitle>
						{href ? (
							<a href={href} className="after:absolute after:inset-0">
								{name}
							</a>
						) : (
							name
						)}
					</ItemTitle>
				</div>
				<ItemActions className="relative z-10">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => refresh()}
						disabled={isPending}
					>
						<RefreshCw className={cn("size-4", isPending && "animate-spin")} />
					</Button>
				</ItemActions>
			</ItemHeader>
			<ItemFooter className="flex w-full flex-col items-start gap-1 rounded-b-xl border-t pt-2">
				<ServiceStatus status={status} />
			</ItemFooter>
		</Item>
	);
};
