"use client";

import { deleteTeamInvite } from "@/actions/delete-team-invite";
import { deleteTeamMember } from "@/actions/delete-team-member";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEAM_MEMBER_ROLES } from "@/db/schema";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { capitalize } from "lodash";
import { XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<{
  name: string;
  email: string;
  role: (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES] | "INVITED";
}>();

interface TeamMembersTableProps {
  data: {
    name: string;
    email: string;
    role:
      | (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES]
      | "INVITED";
  }[];
  teamId: string;
  isAdmin: boolean;
}

function TeamMembersTable({ data, teamId, isAdmin }: TeamMembersTableProps) {
  const deleteTeamMemberWithId = deleteTeamMember.bind(null, teamId);
  const deleteTeamInviteWithId = deleteTeamInvite.bind(null, teamId);

  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row, getValue }) => (
          <div
            className={row.original.role === "INVITED" ? "text-zinc-400" : ""}
          >
            <div>{getValue()}</div>
            {row.original.role !== "INVITED" && (
              <div className="text-xs text-zinc-400">{row.original.email}</div>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: ({ row, getValue }) => (
          <span
            className={row.original.role === "INVITED" ? "text-zinc-400" : ""}
          >
            {capitalize(getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) =>
          isAdmin ? (
            <>
              {row.original.role === "INVITED" ? (
                <Button
                  size="sm"
                  className="h-min bg-red-400 py-1 hover:bg-red-500"
                  variant="outline"
                  disabled={loading}
                  aria-disabled={loading}
                  onClick={async () => {
                    setLoading(true);

                    try {
                      const formData = new FormData();

                      formData.append("email", row.original.email);

                      await deleteTeamInviteWithId(formData);
                      toast.success("Team invite deleted");
                    } catch (err) {
                      if (err instanceof Error) {
                        toast.error(err.message);
                      } else {
                        toast.error("Couldn't delete team invite");
                      }
                    }

                    setLoading(false);
                  }}
                >
                  <XIcon className="w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-min bg-red-400 py-1 hover:bg-red-500"
                  variant="outline"
                  disabled={loading}
                  aria-disabled={loading}
                  onClick={async () => {
                    setLoading(true);

                    try {
                      const formData = new FormData();

                      formData.append("email", row.original.email);

                      await deleteTeamMemberWithId(formData);
                      toast.success("Team member deleted");
                    } catch (err) {
                      if (err instanceof Error) {
                        toast.error(err.message);
                      } else {
                        toast.error("Couldn't delete team member");
                      }
                    }

                    setLoading(false);
                  }}
                >
                  <XIcon className="w-4" />
                </Button>
              )}
            </>
          ) : (
            <></>
          ),
      }),
    ],
    [deleteTeamMemberWithId, deleteTeamInviteWithId, loading, isAdmin],
  );

  const table = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data,
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TeamMembersTable;
