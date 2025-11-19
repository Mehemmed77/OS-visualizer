import { EventItem, ProcessListItem } from "../types";
import EventQueue from "./event-queue";
import Process from "./process";
import Scheduler from "./scheduler";

export default class SimulationEngine {
    totalTimeRemaining = 0; // Calculated from overall bursts of all processes during hydration.
    time = 0; // Where we are at right now.
    processes: Process[] = [];
    scheduler: Scheduler;

    constructor(processList: ProcessListItem[], schedulerMode: string) {
        this.hydrate(processList);
        this.scheduler = new Scheduler(schedulerMode, this.processes);
    }
    
    hydrate(processList: ProcessListItem[]) {
        processList.forEach(p => {
            const newProcess = new Process(p);
            this.processes.push(newProcess);
            this.totalTimeRemaining += newProcess.totalBurstTime;
        });
    }

    runStep() {
        const events = EventQueue.getEventsAtAndRemove(this.time);
        this.handleEvents(events);
        
        for(const process of this.processes) {
        }
    }

    handleEvents(events: EventItem[]) {
        for(const event of events) {
            const process = this.processes.find(p => p.pid === event.pid);
            if (!process) continue;

            if (event.type === "CPU_DONE") this.handleCpuDone(process);

            else if (event.type === "IO_DONE") this.handleIoDone(process);
        }
    }

    handleCpuDone(process: Process) {
        process.finishCpuBurst();
        if (process.state !== "TERMINATED") {
            this.scheduler.setProcessBlocked();
        }
    }

    handleIoDone(process: Process) {
        process.finishIoBurst();
        if (process.state !== "TERMINATED") {
            this.scheduler.onProcessArrive(process);
        }
    }

    dispatchCpuIfIdle() {
        if (!this.scheduler.isCpuIdle()) return null;
        const process = this.scheduler.selectNextProcess();
        if (!process) return null;

        process.startCpuBurst();
        EventQueue.scheduleCpuDone(this.time, process);
    }

    isSimulationFinished() {

    }

    runUntilFinished() {
        while (this.totalTimeRemaining > this.time) {
            
            
            
            
            this.time += 1;
        }
    }
}