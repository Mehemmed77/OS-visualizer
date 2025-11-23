import FastPriorityQueue from "fastpriorityqueue";
import { EventType, EventItem } from "../types";
import Process from "./process";

export default class EventQueue {
    static events = new FastPriorityQueue<EventItem>((a, b) => a.time < b.time);

    static scheduleCpuDone(time: number, process: Process) {
        const endTime = time + process.currentCpuBurstRemaining;

        EventQueue.events.add({
            time: endTime,
            pid: process.pid,
            type: "CPU_DONE"
        });
    }

    static scheduleIoDone(time: number, process: Process) {
        const endTime = time + process.currentIoBurstRemaining;

        EventQueue.events.add({
            time: endTime,
            pid: process.pid,
            type: "IO_DONE"
        });
    }

    static getNextEvents() {
        if (EventQueue.events.isEmpty()) return [];

        const events: EventItem[] = [];
        let first = EventQueue.events.peek();
        const earliestTime = first?.time;

        while (!EventQueue.events.isEmpty() && EventQueue.events.peek()?.time === earliestTime) {
            events.push(EventQueue.events.poll() as EventItem);
        }

        return events;
    }
}