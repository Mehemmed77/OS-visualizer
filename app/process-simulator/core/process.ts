import { BurstItem, ProcessListItem, STATE } from "../types";

export default class Process {
    pid: number;
    name: string;
    cpuTotal: number;
    ioTotal = 0;
    cpuBurstInterval = 0;
    ioBurstInterval = 0;
    state: STATE = "READY";
    currentCpuBurstRemaining: number = 0;
    currentIoBurstRemaining: number = 0;
    bursts: BurstItem[] = [];

    constructor(process: ProcessListItem, bursts: BurstItem[],
    ) {
        this.pid = process.pid;
        this.name = process.name;
        this.cpuTotal = process.cpuTotal;
        this.ioTotal = process.ioTotal;
        this.cpuBurstInterval = process.cpuBurstInterval;
        this.ioBurstInterval = process.ioBurstInterval;
        this.bursts = bursts;
    }
}