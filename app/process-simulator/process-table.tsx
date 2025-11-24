import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { ProcessListItem, snapshotItem } from "./types"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

interface ProcessTableProps {
  time: number,
  snapshots: snapshotItem[]
}

export default function ProcessTable( {time, snapshots}: ProcessTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Time</TableHead>

          {(Object.keys(snapshots[0]) as (keyof snapshotItem)[]).map(k => {
            if (k !== "time" && k !== "notes") {
              return <TableHead key={k} className="font-bold">{ k }</TableHead>
            }
          })}

          <TableHead>Notes</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
          {snapshots.map(snapshot => (
            <TableRow key={snapshot.time}>
              {
                (Object.keys(snapshot) as (keyof snapshotItem)[]).map(s => {
                  return (
                    <TableCell key={s} className={
                        (s !== "time" && s !== "notes") ? "font-medium" : ""
                    }>{snapshot[s]}</TableCell>
                  )
                })
              }
            </TableRow>
          ))}
          <TableRow>
            {/* <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
          </TableRow>
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  )
}