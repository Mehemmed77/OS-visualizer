export interface ProcessListItem {
    pid: number,
    name: string,
    cpuTotal: 0,
    ioTotal: 0,
    cpuBurstInterval: 0,
    ioBurstInterval: 0,
}

export type STATE = "NEW" | "READY" | "RUNNING" | "BLOCKED" | "TERMINATED";

export type ACTION = "IO_DONE" | "CPU_DONE" | "START_IO" | "START_CPU" | undefined;

export interface EventItem {
    time: number;
    pid: number;
    action: ACTION;
}

export type BurstType = "CPU" | "IO";

export type BurstItem = {
    type: BurstType,
    length: number,
}
