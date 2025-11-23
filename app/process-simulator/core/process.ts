import { BurstItem, BurstType, ProcessListItem, STATE } from "../types";

export default class Process {
  pid: number;
  name: string;
  state: STATE = "NEW";
  currentCpuBurstRemaining: number = 0;
  currentIoBurstRemaining: number = 0;
  burstIndex = 0;
  bursts: BurstItem[] = [];
  totalBurstTime = 0;

  startCpuBurst() {
    this.state = "RUNNING";
    this.currentCpuBurstRemaining = this.bursts[this.burstIndex].length;
  }

  finishCpuBurst() {
    if (this.burstIndex + 1 === this.bursts.length) {
      this.state = "TERMINATED";
      return;
    }

    this.currentCpuBurstRemaining = 0;
    this.burstIndex++;
  }

  startIoBurst() {
    this.currentIoBurstRemaining = this.bursts[this.burstIndex].length;
    this.state = "BLOCKED";
  }

  finishIoBurst() {
    if (this.burstIndex === this.bursts.length) {
      this.state = "TERMINATED";
      return;
    }
    this.currentIoBurstRemaining = 0;
    this.burstIndex++;
  }

  checkForNextBurst() {
    if (this.burstIndex < this.bursts.length) {
        if (this.bursts[this.burstIndex].type === "CPU") this.startCpuBurst();
        else this.startIoBurst();
    }
  }

  constructor(process: ProcessListItem) {
    this.pid = process.pid;
    this.name = process.name;
    this.bursts = this.generateBursts(process);
  }

  generateBursts(p: ProcessListItem) {
    const bursts: BurstItem[] = [];
    let cpuTotal = p.cpuTotal;
    let ioTotal = p.ioTotal;
    let type: BurstType = "CPU";

    while (cpuTotal > 0) {
      let length = 0;

      if (type === "CPU") {
        if (cpuTotal > 0) {
          if (ioTotal === 0) length = cpuTotal;
          else length = Math.min(p.cpuBurstInterval, cpuTotal);

          cpuTotal -= length;
        } else break;
      } else {
        if (ioTotal > 0) {
          length = Math.min(p.ioBurstInterval, ioTotal);
          ioTotal -= length;
        }
      }

      if (length > 0) {
        this.totalBurstTime += length;
        bursts.push({
          type: type,
          length: length,
        });
      }

      type = type === "CPU" ? "IO" : "CPU";
    }

    return bursts;
  }
}
