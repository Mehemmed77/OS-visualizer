"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProcessListItem } from "./types";
import Process from "./process";

function generateRandomPID() {
  return Math.floor(Math.random() * 4194304) + 1;
}

export default function ProcessCreator() {
  const [processList, setProcessList] = useState<ProcessListItem[]>([]);

  const addNewProcess = () => {
    if (processList.length === 5) return;

    const pid = generateRandomPID();
    const newProcess: ProcessListItem = {
      name: `PID_${pid}`,
      pid: pid,
      cpuTasks: 0,
      ioOperations: 0,
      frequency: 0,
    };

    setProcessList((prev) => [...prev, newProcess]);
  };

  const handleChange = (pid: number, field: string, value: number) => {
    setProcessList((prev) =>
      prev.map((p) =>
        p.pid !== pid
          ? p
          : {
              ...p,
              [field]: value,
            }
      )
    );
  };

  return (
    <div className="p-4 rounded-md border border-color-os-border bg-color-os-surface text-color-os-foreground">
      <p className="text-3xl font-bold text-color-os-accent">
        Process Configuration
      </p>
      <hr className="my-3 border-color-os-border" />
      <div>
        <Button
          className="cursor-pointer bg-color-os-primary text-color-os-foreground hover:bg-color-os-hover"
          onClick={addNewProcess}
        >
          <Plus />
          Create New Process
        </Button>
        <p className="italic text-color-os-muted mt-1">(Max 5 processes)</p>
      </div>
      <hr className="my-3 border-color-os-border" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
        {processList.map((p) => (
          <Process key={p.pid} process={p} handleChange={handleChange} />
        ))}
      </div>
    </div>
  );
}
