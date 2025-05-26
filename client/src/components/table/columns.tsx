"use client";

import { ColumnDef } from "@tanstack/react-table";

import { RecentUpload, UserData } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteUser } from "@/app/admin/reports/actions";

export const columns: ColumnDef<RecentUpload>[] = [
  // {
  //   accessorKey: "file_name",
  //   header: "File Name",
  //   cell: ({ row }) => (
  //     <p className="text-14-medium">{row.original.file_name}</p>
  //   ),
  // },
  {
    accessorKey: "user",
    header: "Uploaded By",
    cell: ({ row }) => <p className="text-14-medium">{row.original.user}</p>,
  },
  {
    accessorKey: "size_kb",
    header: "Size (KB)",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.size_kb} KB</p>
    ),
  },
  {
    accessorKey: "date_uploaded",
    header: "Date Uploaded",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.date_uploaded}</p>
    ),
  },
  {
    accessorKey: "chats_started",
    header: "Chats Started",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.chats_started}</p>
    ),
  },
];

export const userColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p className="text-14-medium">{row.original.name}</p>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <p className="text-14-regular">{row.original.email}</p>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <p className="text-14-regular">{row.original.role}</p>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <p className="text-14-regular">{row.original.phone ?? "—"}</p>
    ),
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => (
      <p className="text-14-regular">
        {row.original.emailVerified
          ? new Date(row.original.emailVerified).toLocaleDateString()
          : "No"}
      </p>
    ),
  },
  {
    accessorKey: "paystackSubscriptionStart",
    header: "Sub. Start",
    cell: ({ row }) => (
      <p className="text-14-regular">
        {row.original.paystackSubscriptionStart
          ? new Date(
              row.original.paystackSubscriptionStart
            ).toLocaleDateString()
          : "—"}
      </p>
    ),
  },
  {
    accessorKey: "paystackSubscriptionEnd",
    header: "Sub. End",
    cell: ({ row }) => (
      <p className="text-14-regular">
        {row.original.paystackSubscriptionEnd
          ? new Date(row.original.paystackSubscriptionEnd).toLocaleDateString()
          : "—"}
      </p>
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const [isPending, startTransition] = useTransition();

      const handleDelete = () => {
        startTransition(() => {
          try {
            deleteUser(user.id);
            toast.success("User deleted successfully");
          } catch (error) {
            toast.error("Failed to delete user");
          }
        });
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm h-9 px-4 py-2 border border-red-800/50 bg-red-800/50 hover:bg-red-800">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1A1928] border border-muted/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will permanently delete your account and all associated
                data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-800 text-delete-foreground shadow-sm hover:bg-red-800/90 h-9 px-4 py-2"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
