"use client";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => any;
  title: string;
}

export default function NumberInput({
  value,
  onChange,
  title,
}: NumberInputProps) {
  return (
    <div>
      <p className="font-bold mb-2 text-color-os-muted">{title}</p>
      <div className="flex h-10 min-w-30 rounded-md border border-color-os-border bg-color-os-background">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-1/3 border-r border-color-os-border hover:bg-color-os-surface transition-colors cursor-pointer"
        >
          <Minus className="mx-auto text-color-os-foreground" />
        </button>
        <div className="w-1/3 flex items-center justify-center text-color-os-foreground">
          <span className="text-lg">{value}</span>
        </div>
        <button
          onClick={() => onChange(value + 1)}
          className="w-1/3 border-l border-color-os-border hover:bg-color-os-surface transition-colors cursor-pointer"
        >
          <Plus className="mx-auto text-color-os-foreground" />
        </button>
      </div>
    </div>
  );
}
