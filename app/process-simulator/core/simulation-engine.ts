import { TruckElectric } from "lucide-react";
import { EventItem, ProcessListItem, snapshotItem } from "../types";
import EventQueue from "./event-queue";
import Process from "./process";
import Scheduler from "./scheduler";

export default class SimulationEngine {
  totalTimeRemaining = 0; // Calculated from overall bursts of all processes during hydration.
  time = 0; // Where we are at right now.
  processes: Process[] = [];
  scheduler: Scheduler;
  isTerminated: Record<number, boolean> = {};
  snapshots: snapshotItem[] = [];

  constructor(processList: ProcessListItem[], schedulerMode: string) {
    this.hydrate(processList);
    this.scheduler = new Scheduler(schedulerMode, this.processes);
  }

  hydrate(processList: ProcessListItem[]) {
    processList.forEach((p) => {
      const newProcess = new Process(p);
      this.isTerminated[newProcess.pid] = false;
      this.processes.push(newProcess);
      this.totalTimeRemaining += newProcess.totalBurstTime;
    });
  }

  runStep() {
    const events = EventQueue.getNextEvents();

    if (events.length === 0) return;

    const nextTime = events[0].time;

    for (let t = this.time; t < nextTime; t++) this.createSnapshot(t);

    this.time = nextTime;
    this.handleEvents(events);
    this.dispatchCpuIfIdle();
  }

  handleEvents(events: EventItem[]) {
    for (const event of events) {
      const process = this.processes.find((p) => p.pid === event.pid);
      if (!process) continue;

      if (event.type === "CPU_DONE") {
        this.handleCpuDone(process);
      } else if (event.type === "IO_DONE") this.handleIoDone(process);
    }
  }

  createSnapshot(t: number) {
    const item: snapshotItem = {
      time: t,
    };

    for(let i = 0; i < this.processes.length; i++) {
      const key = `process_${i}` as const;
      item[key] = this.processes[i].state; 
    }

    item["notes"] = "";

    this.snapshots.push(item);

    console.log(
      this.processes.map((p) => ({
        pid: p.pid,
        name: p.name,
        state: p.state,
        burstIndex: p.burstIndex,
        cpuLeft: p.currentCpuBurstRemaining,
        ioLeft: p.currentIoBurstRemaining,
      }))
    );
  }

  handleCpuDone(process: Process) {
    process.finishCpuBurst();
    if (process.state !== "TERMINATED") {
      this.scheduler.setProcessBlocked(process);
      process.startIoBurst();
      EventQueue.scheduleIoDone(this.time, process)
      console.log("CPU DONE FOR ", process.pid);
    }
    else{
      this.scheduler.terminateProcess();
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

  isFinished() {
    return Object.values(this.isTerminated).some(b => b === false);
  }

  terminateAll() {

  }

  runUntilFinished() {
    let count = 0;
    this.dispatchCpuIfIdle();
    while (!EventQueue.events.isEmpty() ||
    !this.scheduler.isCpuIdle() ||
    !this.scheduler.readyQueue.isEmpty()) {
      if (count >= 1000) break;

      this.runStep();
      count++;
    }

    this.createSnapshot(this.time);

    return this.snapshots;
  }
}
