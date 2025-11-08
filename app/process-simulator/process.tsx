"use client";

import { ProcessListItem } from "./types";
import NumberInput from "./number-input";
import { Trash2 } from "lucide-react";

interface ProcessProps {
  process: ProcessListItem;
  handleChange: (pid: number, field: string, value: number) => any;
}

export default function Process({ process, handleChange }: ProcessProps) {
  return (
    <div className="border border-color-os-border bg-color-os-background text-color-os-foreground p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-[100px] font-semibold">{process.name}</div>
        <button
          className="text-color-os-terminated hover:text-color-os-waiting transition-colors cursor-pointer p-2 rounded-full hover:bg-color-os-surface"
          title="Delete process"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <hr className="my-2 border-color-os-border" />
      <div className="flex flex-wrap items-center gap-6">
        <NumberInput
          title="# of CPU instructions"
          value={process.cpuTasks}
          onChange={(value) => handleChange(process.pid, "cpuTasks", value)}
        />
        <NumberInput
          title="# of I/O operations"
          value={process.ioOperations}
          onChange={(value) => handleChange(process.pid, "ioOperations", value)}
        />
        <NumberInput
          title="Frequency"
          value={process.frequency}
          onChange={(value) => handleChange(process.pid, "frequency", value)}
        />
      </div>
    </div>
  );
}
