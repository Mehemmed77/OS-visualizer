import { ProcessListItem } from "../types";

export default function scheduler(processList: ProcessListItem[]) {
    const processes = structuredClone(processList);
    
    const tasks: any[] = [];
    let n = 1;
    let process_count = 0;
    for(const process of processes) {
        for(let i = 0; i < process.cpuTasks; i++) {
            const pid = process.pid;
            const task = {
                time: n,
                [`process_${process_count}`]: "RUNNING",
            };

            processes.forEach((p, index) => {
                if (p.pid !== pid) {
                    task[`process_${index}`] = "READY";
                }
            });

            tasks.push(task);

            n++;
        }

        process_count++;
    }

    return tasks;
}