"use client";

import { RoundRobinTable } from "./RoundRobinTable";
import type { RoundRobinTableProps } from "./RoundRobinTable";

export type RoundRobinViewProps = RoundRobinTableProps;

export function RoundRobinView(props: RoundRobinViewProps) {
  return <RoundRobinTable {...props} />;
}
