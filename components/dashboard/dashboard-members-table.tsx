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
import type { ChamaMember } from "@/lib/types";

type MemberRole = "Admin" | "Treasurer" | "Member";

interface MemberRow {
  id: string;
  fullName: string;
  email: string;
  role: MemberRole;
  contributionKes: number;
  joinDate: string;
  status: "Active" | "Invited";
}

interface DashboardMembersTableProps {
  members: ChamaMember[];
  chamaName?: string;
}

function formatRole(role: ChamaMember["role"]): MemberRole {
  if (role === "admin") {
    return "Admin";
  }

  if (role === "treasurer") {
    return "Treasurer";
  }

  return "Member";
}

function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "Member";
  return localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function DashboardMembersTable({
  members,
  chamaName,
}: DashboardMembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"All" | MemberRole>("All");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableData = useMemo<MemberRow[]>(() => {
    return members.map((member, index) => ({
      id: member.id ?? `M-${String(index + 1).padStart(3, "0")}`,
      fullName: member.fullName?.trim().length
        ? member.fullName
        : deriveNameFromEmail(member.email),
      email: member.email,
      role: formatRole(member.role),
      contributionKes: member.contributionKes ?? 0,
      joinDate: member.joinedAt ?? "-",
      status: member.status === "invited" ? "Invited" : "Active",
    }));
  }, [members]);

  const filteredData = useMemo(() => {
    return tableData.filter((member) => {
      const matchesRole =
        selectedRole === "All" || member.role === selectedRole;
      const search = searchQuery.toLowerCase().trim();

      if (search.length === 0) {
        return matchesRole;
      }

      const matchesSearch =
        member.fullName.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.id.toLowerCase().includes(search);

      return matchesRole && matchesSearch;
    });
  }, [searchQuery, selectedRole, tableData]);

  const totalContributions = useMemo(
    () => tableData.reduce((sum, member) => sum + member.contributionKes, 0),
    [tableData],
  );

  useEffect(() => {
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  }, [searchQuery, selectedRole]);

  const columns = useMemo<ColumnDef<MemberRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Member
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{row.original.fullName}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "contributionKes",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contribution
            <ArrowUpDown className="size-4" />
          </button>
        ),
        cell: ({ row }) =>
          `KES ${row.original.contributionKes.toLocaleString()}`,
      },
      {
        accessorKey: "joinDate",
        header: "Joined",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={
              row.original.status === "Active"
                ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            }
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
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
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {tableData.length > 0
              ? `Manage admins, treasurers, and members in ${chamaName ?? "your chama"}.`
              : "This account has no members yet. Login with the test user to view preloaded members."}
          </p>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Total contributions: KES {totalContributions.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name, email, or member ID"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          />
          <select
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(event.target.value as "All" | MemberRole)
            }
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admins</option>
            <option value="Treasurer">Treasurers</option>
            <option value="Member">Members</option>
          </select>
        </div>
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
                  No members found for that filter.
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
          Showing {table.getRowModel().rows.length} of {filteredData.length}
          {searchQuery || selectedRole !== "All" ? " filtered" : ""} members
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-xs font-medium">
            Rows
          </label>
          <select
            id="pageSize"
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
