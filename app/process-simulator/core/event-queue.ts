import { ACTION, EventItem } from "../types";
import Process from "./process";

export default class EventQueue {
    events: EventItem[] = [];

    scheduleEndEvent(time: number, process: Process, action: ACTION) {
        let endTime = action === "START_IO" ? time + process.currentIoBurstRemaining : time + process.currentCpuBurstRemaining;
        let endAction: ACTION = action === "START_IO" ? "IO_DONE" : "CPU_DONE";

        this.events.push({
            time: endTime,
            pid: process.pid,
            action: endAction,
        })
    }
}