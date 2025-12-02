"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { ProcessListItem, snapshotItem } from "./types";
import { useEffect, useRef, useState } from "react";
import { FastForward, Rewind, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface ProcessTableProps {
  snapshots: snapshotItem[];
}

export default function ProcessTable({ snapshots }: ProcessTableProps) {
  const [time, setTime] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const maxLength = useRef<number>(snapshots[snapshots.length - 1].time);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        console.log("ishleyir");

        setTime((prev) => {
          if (prev >= maxLength.current) {
            clearInterval(intervalId);
            return prev;
          }

          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  return (
    <>
      <div className="my-2 flex gap-3">
        <Button
          className="cursor-pointer"
          onClick={() => {
            if (time === -1) return;
            setTime((prev) => prev - 1);
          }}
        >
          <Rewind />
        </Button>

        <Button
          className="cursor-pointer"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? <Play /> : <Pause />}
        </Button>

        <Button
          className="cursor-pointer"
          onClick={() => setTime((prev) => prev + 1)}
        >
          <FastForward />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>

            {(Object.keys(snapshots[0]) as (keyof snapshotItem)[]).map((k) => {
              if (k !== "time" && k !== "notes") {
                return (
                  <TableHead key={k} className="font-bold">
                    {k.toUpperCase()}
                  </TableHead>
                );
              }
            })}

            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        <AnimatePresence initial={false}>
          {snapshots.map((snapshot, idx) => {
            if (idx > time) return null;

            return (
              <motion.tr
                key={snapshot.time}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {(Object.keys(snapshot) as (keyof snapshotItem)[]).map((s) => (
                  <TableCell key={s}>
                    <p
                      className={
                        s !== "time" && s !== "notes"
                          ? `font-medium text-os-${snapshot[s]?.toLowerCase()}`
                          : ""
                      }
                    >
                      {snapshot[s]}
                    </p>
                  </TableCell>
                ))}
              </motion.tr>
            );
          })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </>
  );
}
