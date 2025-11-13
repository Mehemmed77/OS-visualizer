"use client";

import { ProcessListItem } from "./types";
import NumberInput from "./number-input";
import { Trash2 } from "lucide-react";

interface ProcessProps {
  process: ProcessListItem;
  handleChange: (pid: number, field: string, value: number) => any;
  handleDelete: (pid: number) => any;
}

export default function ProcessItem({ process, handleChange, handleDelete }: ProcessProps) {
  return (
    <div className="border border-color-os-border bg-color-os-background text-color-os-foreground p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-[100px] font-semibold">{process.name}</div>
        <button onClick={() => handleDelete(process.pid)}
          className="text-color-os-terminated hover:text-color-os-waiting transition-colors cursor-pointer p-2 rounded-full hover:bg-color-os-surface"
          title="Delete process"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <hr className="my-2 border-color-os-border" />
      <div className="flex flex-wrap items-center gap-6">
        <NumberInput
          title="# CPU total"
          value={process.cpuTotal}
          onChange={(value) => handleChange(process.pid, "cpuTotal", value)}
        />

        <NumberInput
          title="# I/O total"
          value={process.ioTotal}
          onChange={(value) => handleChange(process.pid, "ioTotal", value)}
        />

        <NumberInput
          title="CPU Burst Interval"
          value={process.cpuBurstInterval}
          onChange={(value) => handleChange(process.pid, "cpuBurstInterval", value)}
        />

        <NumberInput
          title="IO Burst Interval"
          value={process.ioBurstInterval}
          onChange={(value) => handleChange(process.pid, "ioBurstInterval", value)}
        />
      </div>
    </div>
  );
}
