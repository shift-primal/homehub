import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";

import {
	Item,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemTitle,
} from "#/components/ui/item.tsx";
import {
	type BeszelResult,
	type BeszelSystem,
	getBeszel,
} from "#/server/beszel.ts";

// Beszel alerts on disk at 85% (alert rules in beszel.nix, shift-primal/nixos).
const WARN = 70;
const ALERT = 85;

function barColor(pct: number) {
	if (pct >= ALERT) return "bg-red-500";
	if (pct >= WARN) return "bg-yellow-500";
	return "bg-green-500";
}

function formatUptime(seconds: number) {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

const Meter = ({ label, pct }: { label: string; pct: number }) => (
	<div className="grid grid-cols-[5rem_1fr_3rem] items-center gap-2 text-xs">
		<span className="text-muted-foreground truncate">{label}</span>
		<div className="bg-muted h-2 overflow-hidden rounded-full">
			<div
				className={`h-full ${barColor(pct)}`}
				style={{ width: `${Math.min(pct, 100)}%` }}
			/>
		</div>
		<span className="text-right tabular-nums">{pct}%</span>
	</div>
);

const SystemItem = ({ system }: { system: BeszelSystem }) => {
	const up = system.status === "up";
	const details = [
		up && `up ${formatUptime(system.uptime)}`,
		system.temp !== undefined && `${system.temp} °C`,
		system.failedServices &&
			`${system.failedServices} failed unit${system.failedServices > 1 ? "s" : ""}`,
	].filter(Boolean);

	return (
		<Item variant="outline">
			<ItemHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-3">
					<ItemMedia>
						<Activity className="size-6" />
					</ItemMedia>
					<ItemTitle>{system.name}</ItemTitle>
				</div>
				<span
					className={`size-2.5 rounded-full ${up ? "bg-green-500" : "bg-red-500"}`}
					title={system.status}
				/>
			</ItemHeader>
			{up ? (
				<div className="flex w-full flex-col gap-1.5">
					<Meter label="CPU" pct={system.cpu} />
					<Meter label="RAM" pct={system.mem} />
					{system.disks.map((d) => (
						<Meter key={d.name} label={d.name} pct={d.pct} />
					))}
				</div>
			) : null}
			<ItemFooter className="w-full border-t pt-2">
				<ItemDescription className="text-muted-foreground text-xs">
					{up ? details.join(" · ") : system.status}
				</ItemDescription>
			</ItemFooter>
		</Item>
	);
};

export const BeszelGroup = ({ initial }: { initial: BeszelResult }) => {
	const { data } = useQuery({
		queryKey: ["beszel"],
		queryFn: () => getBeszel(),
		initialData: initial,
		// Beszel's agent reports once a minute.
		refetchInterval: 30_000,
	});

	return (
		<ItemGroup className="max-w-sm">
			<p className="mb-2 text-lg font-semibold">Server</p>
			{data.state === "ok" ? (
				data.systems.map((s) => <SystemItem key={s.id} system={s} />)
			) : (
				<p className="text-muted-foreground text-sm">
					{data.state === "skipped"
						? "Beszel: prod only"
						: `Beszel unreachable (${data.error})`}
				</p>
			)}
		</ItemGroup>
	);
};
