"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { ContributionRecord } from "@/lib/types";

interface DashboardContributionsTableProps {
  contributions: ContributionRecord[];
}

interface ContributionRow {
  id: string;
  contributorName: string;
  contributorEmail: string;
  amountKes: number;
  contributedAt: string;
  reference: string;
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function DashboardContributionsTable({
  contributions,
}: DashboardContributionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "contributedAt", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const rows = useMemo<ContributionRow[]>(
    () =>
      contributions.map((item) => ({
        id: item.id,
        contributorName: item.contributorName,
        contributorEmail: item.contributorEmail,
        amountKes: item.amountKes,
        contributedAt: item.contributedAt,
        reference: item.reference,
      })),
    [contributions],
  );

  const filteredRows = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    const min = minAmount ? Number(minAmount) : undefined;
    const max = maxAmount ? Number(maxAmount) : undefined;

    return rows.filter((row) => {
      const matchesSearch =
        search.length === 0 ||
        row.contributorName.toLowerCase().includes(search) ||
        row.contributorEmail.toLowerCase().includes(search) ||
        row.reference.toLowerCase().includes(search) ||
        row.amountKes.toString().includes(search) ||
        row.amountKes.toLocaleString().includes(search);

      const matchesAmountRange =
        (min === undefined || row.amountKes >= min) &&
        (max === undefined || row.amountKes <= max);

      const matchesDateRange =
        (!fromDate || row.contributedAt >= fromDate) &&
        (!toDate || row.contributedAt <= toDate);

      return matchesSearch && matchesAmountRange && matchesDateRange;
    });
  }, [rows, searchQuery, minAmount, maxAmount, fromDate, toDate]);

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  }, [searchQuery, minAmount, maxAmount, fromDate, toDate]);

  const filteredTotal = useMemo(
    () => filteredRows.reduce((sum, row) => sum + row.amountKes, 0),
    [filteredRows],
  );

  const columns = useMemo<ColumnDef<ContributionRow>[]>(
    () => [
      {
        accessorKey: "contributorName",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contributor
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{row.original.contributorName}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {row.original.contributorEmail}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "amountKes",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) => `KES ${row.original.amountKes.toLocaleString()}`,
      },
      {
        accessorKey: "contributedAt",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) => formatDate(row.original.contributedAt),
      },
      {
        accessorKey: "reference",
        header: "Reference",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-4 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Contributions</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Search by contributor or amount, filter by amount/date ranges, then
          sort and paginate through contribution history.
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Filtered total: KES {filteredTotal.toLocaleString()}
        </p>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search name, email, ref, amount"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          type="number"
          min={0}
          value={minAmount}
          onChange={(event) => setMinAmount(event.target.value)}
          placeholder="Min amount"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          type="number"
          min={0}
          value={maxAmount}
          onChange={(event) => setMaxAmount(event.target.value)}
          placeholder="Max amount"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No contributions found for this filter.
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {table.getRowModel().rows.length} of {filteredRows.length}
          {searchQuery || minAmount || maxAmount || fromDate || toDate
            ? " filtered"
            : ""}{" "}
          contributions
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="contribPageSize" className="text-xs font-medium">
            Rows
          </label>
          <select
            id="contribPageSize"
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Previous
          </button>
          <span className="text-xs font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
