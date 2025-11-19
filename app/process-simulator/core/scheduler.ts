import EventQueue from "./event-queue";
import Process from "./process";

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
    if (this.mode === "FCFS") return this.fcfs();
    if (this.mode === "SJF") return this.sjf();
    if (this.mode === "RR") return this.rr();
  }

  setProcessBlocked() {
    if (!this.runningProcess) return null;

    const p = this.runningProcess;
    p.state = "BLOCKED";
    this.runningProcess = null;
    return p;
  }

  isCpuIdle() {
    return this.runningProcess === null;
  }

  fcfs() {
    return this.readyQueue.dequeue();
  }

  sjf() {
    return null;
  }

  rr() {
    return null;
  }
}
