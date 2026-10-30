import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, BadgeQuestionMark, RefreshCw } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import {
	Item,
	ItemActions,
	ItemDescription,
	ItemFooter,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "#/components/ui/item.tsx";
import type { PreparedServiceCard } from "#/domain/services.ts";
import { icons } from "#/icons.ts";
import { checkSingleService } from "#/server/get-service.ts";

const ICON_MAP = {
	check: Check,
	x: X,
	question: BadgeQuestionMark,
} as const;

export const ServiceCard = ({ id, name, status }: PreparedServiceCard) => {
	const brandIcon = icons[id];
	const queryClient = useQueryClient();

	const { mutate: refreshService, isPending } = useMutation({
		mutationFn: () => checkSingleService({ data: id }),
		onSuccess: (updatedCard) => {
			queryClient.setQueryData<PreparedServiceCard[]>(
				["services"],
				(oldServices) => {
					if (!oldServices) return [updatedCard];
					return oldServices.map((service) =>
						service.id === id ? updatedCard : service,
					);
				},
			);
		},
		onError: (error) => {
			console.error(`Failed to refresh service ${id}:`, error);
		},
	});

	const StatusIcon = ICON_MAP[status.iconName];

	return (
		<Item
			variant="outline"
			className={isPending ? "opacity-70 transition-opacity" : ""}
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
					<ItemTitle>{name}</ItemTitle>
				</div>
				<ItemActions>
					<Button
						size="icon"
						variant="ghost"
						onClick={() => refreshService()}
						disabled={isPending}
					>
						<RefreshCw
							className={`size-4 ${isPending ? "animate-spin" : ""}`}
						/>
					</Button>
				</ItemActions>
			</ItemHeader>
			<ItemFooter className="flex w-full flex-col items-start gap-1 rounded-b-xl border-t pt-2">
				<div className="flex items-center gap-2">
					<StatusIcon className="inline size-5" color={status.color} />
					<span className="text-sm font-medium">{status.title}</span>
				</div>
				<ItemDescription className="text-muted-foreground pl-7 text-xs">
					{status.description}
				</ItemDescription>
			</ItemFooter>
		</Item>
	);
};
