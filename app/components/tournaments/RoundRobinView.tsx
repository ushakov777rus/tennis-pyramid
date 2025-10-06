"use client";

import { GroupStageTable } from "./GroupStageTable";
import type { GroupStageTableProps } from "./GroupStageTable";

export type RoundRobinViewProps = GroupStageTableProps;

export function RoundRobinView(props: RoundRobinViewProps) {
  return <GroupStageTable {...props} />;
}
