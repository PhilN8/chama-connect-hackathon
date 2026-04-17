"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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

const fakeMembers: MemberRow[] = [
  {
    id: "M-001",
    fullName: "Amina Wanjiru",
    email: "amina@chama.co.ke",
    role: "Admin",
    contributionKes: 25000,
    joinDate: "2025-08-02",
    status: "Active",
  },
  {
    id: "M-002",
    fullName: "Brian Otieno",
    email: "brian@chama.co.ke",
    role: "Treasurer",
    contributionKes: 18500,
    joinDate: "2025-09-14",
    status: "Active",
  },
  {
    id: "M-003",
    fullName: "Caroline Njeri",
    email: "caroline@chama.co.ke",
    role: "Member",
    contributionKes: 14500,
    joinDate: "2025-10-01",
    status: "Active",
  },
  {
    id: "M-004",
    fullName: "David Kiptoo",
    email: "david@chama.co.ke",
    role: "Member",
    contributionKes: 9800,
    joinDate: "2025-10-18",
    status: "Invited",
  },
  {
    id: "M-005",
    fullName: "Esther Mwende",
    email: "esther@chama.co.ke",
    role: "Treasurer",
    contributionKes: 16800,
    joinDate: "2025-11-03",
    status: "Active",
  },
  {
    id: "M-006",
    fullName: "Felix Ochieng",
    email: "felix@chama.co.ke",
    role: "Member",
    contributionKes: 7300,
    joinDate: "2025-11-25",
    status: "Active",
  },
  {
    id: "M-007",
    fullName: "Grace Wambui",
    email: "grace@chama.co.ke",
    role: "Member",
    contributionKes: 12100,
    joinDate: "2025-12-10",
    status: "Active",
  },
  {
    id: "M-008",
    fullName: "Hassan Abdi",
    email: "hassan@chama.co.ke",
    role: "Member",
    contributionKes: 6600,
    joinDate: "2026-01-06",
    status: "Invited",
  },
  {
    id: "M-009",
    fullName: "Irene Atieno",
    email: "irene@chama.co.ke",
    role: "Treasurer",
    contributionKes: 22000,
    joinDate: "2026-01-22",
    status: "Active",
  },
  {
    id: "M-010",
    fullName: "John Kamau",
    email: "john@chama.co.ke",
    role: "Member",
    contributionKes: 5400,
    joinDate: "2026-02-03",
    status: "Active",
  },
  {
    id: "M-011",
    fullName: "Kevin Maina",
    email: "kevin@chama.co.ke",
    role: "Admin",
    contributionKes: 27500,
    joinDate: "2026-02-18",
    status: "Active",
  },
  {
    id: "M-012",
    fullName: "Linet Chebet",
    email: "linet@chama.co.ke",
    role: "Member",
    contributionKes: 8800,
    joinDate: "2026-03-04",
    status: "Invited",
  },
];

export function DashboardMembersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"All" | MemberRole>("All");

  const filteredData = useMemo(() => {
    return fakeMembers.filter((member) => {
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage admins, treasurers, and members in one place.
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
    </section>
  );
}
