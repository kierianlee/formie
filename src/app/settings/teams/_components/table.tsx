"use client";

import { acceptTeamInvite } from "@/actions/accept-team-invite";
import { declineTeamInvite } from "@/actions/decline-team-invite";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEAM_MEMBER_ROLES, Team } from "@/db/schema";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const columnHelper = createColumnHelper<
  Team & {
    role:
      | (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES]
      | "INVITED";
    inviteId?: string;
  }
>();

interface TeamsTableProps {
  data: (Team & {
    role:
      | (typeof TEAM_MEMBER_ROLES)[keyof typeof TEAM_MEMBER_ROLES]
      | "INVITED";
    inviteId?: string;
  })[];
}

function TeamsTable({ data }: TeamsTableProps) {
  const [loading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <>
            {row.original.role === "INVITED" ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-min py-1"
                  variant="default"
                  disabled={loading}
                  aria-disabled={loading}
                  onClick={async () => {
                    setLoading(true);

                    if (row.original.inviteId) {
                      try {
                        const acceptTeamInviteWithId = acceptTeamInvite.bind(
                          null,
                          row.original.inviteId,
                        );

                        await acceptTeamInviteWithId();
                        toast.success("Team invite accepted");
                      } catch (err) {
                        if (err instanceof Error) {
                          toast.error(err.message);
                        } else {
                          toast.error("Couldn't accept team invite");
                        }
                      }
                    }

                    setLoading(false);
                  }}
                >
                  Accept Invite
                </Button>
                <Button
                  size="sm"
                  className="h-min bg-red-400 py-1 hover:bg-red-500"
                  variant="outline"
                  disabled={loading}
                  aria-disabled={loading}
                  onClick={async () => {
                    setLoading(true);

                    if (row.original.inviteId) {
                      try {
                        const declineTeamInviteWithId = declineTeamInvite.bind(
                          null,
                          row.original.inviteId,
                        );

                        await declineTeamInviteWithId();
                        toast.success("Team invite declined");
                      } catch (err) {
                        if (err instanceof Error) {
                          toast.error(err.message);
                        } else {
                          toast.error("Couldn't decline team invite");
                        }
                      }
                    }

                    setLoading(false);
                  }}
                >
                  Decline Invite
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="h-min py-1"
                variant="outline"
                asChild
              >
                <Link href={`/settings/teams/${row.original.id}`}>
                  <EditIcon className="w-4" />
                </Link>
              </Button>
            )}
          </>
        ),
      }),
    ],
    [loading],
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

export default TeamsTable;
