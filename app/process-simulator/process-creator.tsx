"use client";
import { Button } from "@/components/ui/button";
import { Divide, Plus, Table2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BurstItem, BurstType, ProcessListItem } from "./types";
import ProcessItem from "./process";
import ProcessTable from "./process-table";
import scheduler from "./utils/scheduler";
import Process from "./core/process";

function generateRandomPID() {
  return Math.floor(Math.random() * 4194304) + 1;
}

export default function ProcessCreator() {
  const [processList, setProcessList] = useState<ProcessListItem[]>([]);
  const [newProcessdisabled, setNewProcessDisabled] = useState<boolean>(false);
  const [startDisabled, setStartDisabled] = useState<boolean>(true);
  const [showProcessTable, setShowProcessTable] = useState<boolean>(false);
  const processTableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (processList.length === 0) setStartDisabled(true);
    else setStartDisabled(false);
  }, [processList.length]);

  useEffect(() => {
    if (showProcessTable && processTableRef.current) {
      processTableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showProcessTable]);

  const addNewProcess = () => {
    if (processList.length === 5) return;

    const pid = generateRandomPID();
    const newProcess: ProcessListItem = {
      name: `PID_${pid}`,
      pid: pid,
      cpuTotal: 0,
      ioTotal: 0,
      cpuBurstInterval: 0,
      ioBurstInterval: 0,
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

  const handleDelete = (pid: number) =>
    setProcessList((prev) => prev.filter((p) => p.pid !== pid));

  const start = () => {
    setNewProcessDisabled(true);
    setShowProcessTable(true);

    const processes: Process[] = [];

    processList.forEach((p) => {
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
          }

          else break;
        }

        else {
          if (ioTotal > 0) {
            length = Math.min(p.ioBurstInterval, ioTotal);
            ioTotal -= length;
          }
        }

        if (length > 0) {
          bursts.push({
            type: type,
            length: length,
          });
        }

        type = type === "CPU" ? "IO" : "CPU";
      }

      processes.push(new Process(p, bursts));
    });
  };

  return (
    <>
      <div className="p-4 rounded-md border border-color-os-border bg-color-os-surface text-color-os-foreground">
        <p className="text-3xl font-bold text-color-os-accent">
          Process Configuration
        </p>
        <hr className="my-3 border-color-os-border" />
        <div className="flex justify-between">
          <div>
            <Button
              disabled={newProcessdisabled}
              className="cursor-pointer"
              onClick={addNewProcess}
            >
              <Plus />
              Create New Process
            </Button>
            <p className="italic text-color-os-muted mt-1">(Max 5 processes)</p>
          </div>
          <div>
            <Button
              className="cursor-pointer"
              onClick={start}
              disabled={startDisabled}
            >
              <Table2 />
              Start Visualization
            </Button>
          </div>
        </div>
        <hr className="my-3 border-color-os-border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
          {processList.map((p) => (
            <ProcessItem
              key={p.pid}
              process={p}
              handleChange={handleChange}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
      <div id="process-table" ref={processTableRef}>
        {showProcessTable && (
          <>
            <div className="my-4">
              <p className="text-center text-3xl">Processes</p>
            </div>
            <ProcessTable time={0} processList={processList} />
          </>
        )}
      </div>
    </>
  );
}
