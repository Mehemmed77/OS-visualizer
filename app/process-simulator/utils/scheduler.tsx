import { ProcessListItem } from "../types";

export default function scheduler(processList: ProcessListItem[]) {
    const processes = structuredClone(processList);
    
    const tasks: any[] = [];
    let n = 1;
    let process_count = 0;
    for(const process of processes) {
        const cpuTasks = process.cpuTasks;
        for(let i = 0; i < cpuTasks; i++) {
            console.log(process.name, process.cpuTasks);
            process.cpuTasks -= 1;
            const pid = process.pid;

            const task: Record<string, number | string> = {
                time: n,
            };

            processes.forEach((p, index) => {
                const key = `process_${index}`;
                if (p.pid !== pid) {
                    if (process.cpuTasks <= 0) task[key] = "-";
                    else task[key] = "READY";
                }

                else task[key] = "RUNNING";
            });

            tasks.push(task);

            n++;
        }

        process_count++;
    }

    return tasks;
}