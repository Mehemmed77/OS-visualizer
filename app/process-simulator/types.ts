export interface ProcessListItem {
    pid: number,
    name: string,
    cpuTotal: 0,
    ioTotal: 0,
    cpuBurstInterval: 0,
    ioBurstInterval: 0,
}

export type STATE = "NEW" | "READY" | "RUNNING" | "BLOCKED" | "TERMINATED";

export type EventType = "CPU_DONE" | "IO_DONE";

export interface EventItem {
    time: number;
    pid: number;
    type: EventType;
}

export type BurstType = "CPU" | "IO";

export type BurstItem = {
    type: BurstType,
    length: number,
}

type ProcessCount = 5;

export type snapshotItem = {
    time: number;
    notes?: string ;
} & {
    [K in `process_${number}`]?: STATE | null;
}
