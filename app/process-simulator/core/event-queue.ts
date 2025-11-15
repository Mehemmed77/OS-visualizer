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

    static getEventsAtAndRemove(time: number) {
        // I combined both getEventsAt and RemoveEventsAt
        const events: EventItem[] = [];
        let e = EventQueue.events.peek();
        while (e?.time === time) {
            events.push(e);
            EventQueue.events.poll();
            e = EventQueue.events.peek();
        }

        return events;
    }
}