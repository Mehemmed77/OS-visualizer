import EventQueue from "./event-queue";
import Process from "./process";
import Queue from "./queue";

export default class Scheduler {
  readyQueue: Queue<Process> = new Queue();
  runningProcess: Process | null = null;
  mode: string;

  constructor(mode: string, processList: Process[]) {
    this.mode = mode;
    this.init(processList);
  }

  init(processList: Process[]) {
    // Every process will start with a CPU burst not I/O. Therefore each of the processes
    // are going to be in "READY" state.

    processList.forEach((p) => {
      p.state = "READY";
      this.readyQueue.enqueue(p);
    });
  }

  onProcessArrive(process: Process) {
    process.state = "READY";
    this.readyQueue.enqueue(process);
  }

  onCpuFree() {
    const next = this.selectNextProcess();
    if(!next) return null;

    this.runningProcess = next;
    this.runningProcess.state = "RUNNING";
    return this.runningProcess;
  }

  selectNextProcess() {
    if (this.mode === "FCFS") this.fcfs();
    else if (this.mode === "SJF") this.sjf();
    else if (this.mode === "RR") this.rr();

    return this.runningProcess;
  }

  setProcessBlocked(process: Process) {
    if (!this.runningProcess) return null;
    const p = this.runningProcess;
    p.state = "BLOCKED";
    this.runningProcess = null;
    return p;
  }

  terminateProcess() {
    if(!this.runningProcess) return null;
    const p = this.runningProcess;
    p.state = "TERMINATED";
    this.runningProcess = null;
  }

  isCpuIdle() {
    return this.runningProcess === null;
  }

  fcfs() {
    this.runningProcess = this.readyQueue.dequeue();
  }

  sjf() {
    return null;
  }

  rr() {
    return null;
  }
}
