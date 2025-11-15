import EventQueue from "./event-queue";
import Process from "./process";

export default class Scheduler {
    readyQueue: Queue<Process> = new Queue();
    runningProcess: Process | null = null;

    selectNextProcess() {
        return this.readyQueue.dequeue();
    }

    onProcessArrive(process: Process) {
        process.state = "READY";
        this.readyQueue.enqueue(process);
    }

    startProcess(process: Process, currentTime: number) {
        process.startCpuBurst();
        this.runningProcess = process;
        EventQueue.scheduleCpuDone(currentTime, process);
    }
}