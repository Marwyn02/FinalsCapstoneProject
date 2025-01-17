"use client";

import { Admin, Review } from "@/app/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ReviewDelete } from "../../api/ReviewDelete";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CreateReply } from "@/features/reply/api/CreateReply";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { ReviewRestore } from "../../api/ReviewRestore";
import { DeleteReply } from "@/features/reply/api/DeleteReply";
import { RestoreReply } from "@/features/reply/api/RestoreReply";

const formSchema = z.object({
  message: z.string(),
});

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-start w-min"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return (
        <div className="font-medium capitalize">
          {firstName + " " + lastName}
        </div>
      );
    },
    // sortingFn: (rowA, rowB) => {
    //   const dateA = parseInt(
    //     `${rowA.original.year}${rowA.original.month.padStart(2, "0")}`,
    //     10
    //   );
    //   const dateB = parseInt(
    //     `${rowB.original.year}${rowB.original.month.padStart(2, "0")}`,
    //     10
    //   );
    //   return dateA - dateB;
    // },
  },
  {
    accessorKey: "message",
    header: () => <div>Message</div>,
    cell: ({ row }) => {
      const message = row.original.message;
      return <div className="font-medium">{message}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: () => <div>Rating</div>,
    cell: ({ row }) => {
      const rating = Number(row.getValue("rating"));
      return <div className="font-medium">{rating}</div>;
    },
  },
  {
    accessorKey: "isDeleted",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.original.isDeleted;
      const state = !status ? "Active" : "Deleted";
      return (
        <div
          className={`font-medium ${
            !status ? "text-green-600" : "text-red-700"
          }`}
        >
          {state}
        </div>
      );
    },
  },
  {
    accessorKey: "reply",
    header: () => <div>Reply</div>,
    cell: ({ row }) => {
      const message = row.original.reply?.message;
      const deleted = row.original.reply?.isDeleted;
      return (
        <div className={`font-medium ${deleted ? "text-gray-300" : ""}`}>
          {message}
        </div>
      );
    },
  },
  {
    accessorKey: "replyBy",
    header: () => <div>Replied by</div>,
    cell: ({ row }) => {
      const author = row.original.reply?.author;
      return <div className="font-medium capitalize">{author}</div>;
    },
  },
  {
    accessorKey: "removedReplyBy",
    header: () => <div>Reply removed by</div>,
    cell: ({ row }) => {
      const removedBy = row.original.reply?.removedByAdmin?.username;
      return <div className="font-medium capitalize">{removedBy}</div>;
    },
  },
  {
    accessorKey: "AcceptedBy",
    header: () => <div>Accepted by</div>,
    cell: ({ row }) => {
      const adminName = row.original.addedByAdmin?.username || "N/A";
      return <div className="font-medium capitalize">{adminName}</div>;
    },
  },
  {
    accessorKey: "RemovedBy",
    header: () => <div>Review removed by</div>,
    cell: ({ row }) => {
      const adminName = row.original.removedByAdmin?.username || "N/A";
      return <div className="font-medium capitalize">{adminName}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { reviewId, reply, isDeleted } = row.original;
      const [formLoading, setFormLoading] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setFormLoading(true);
        const uuid = uuidv4().slice(0, 13).toUpperCase();

        if (values && reviewId && (table.options.meta as any)?.adminId) {
          const data = {
            replyId: uuid,
            message: values.message,
            author: (table.options.meta as any)?.username,
            reviewId: reviewId,
            adminId: (table.options.meta as any)?.adminId,
          };
          // Update and create reply
          await CreateReply(data);
          setFormLoading(false);
          setIsDialogOpen(false);
        }
      };

      const handleRestoreReview = async (reviewId: string) => {
        await ReviewRestore(reviewId);
      };

      const handleDeleteReview = async (reviewId: string, adminId: string) => {
        await ReviewDelete(reviewId, adminId);
      };

      const handleDeleteReply = async (
        replyId: string,
        adminId: string,
        username: string
      ) => {
        await DeleteReply(replyId, adminId, username);
      };

      const handleRestoreReply = async (replyId: string) => {
        await RestoreReply(replyId);
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {!reply && !isDeleted && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    Add Reply
                  </DropdownMenuItem>
                </>
              )}

              {reply && !reply.isDeleted && !isDeleted && (
                <>
                  <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                    Edit Reply
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleDeleteReply(
                        reply.replyId,
                        (table.options.meta as any)?.adminId,
                        (table.options.meta as any)?.username
                      )
                    }
                  >
                    Delete Reply
                  </DropdownMenuItem>
                </>
              )}

              {reply && reply.isDeleted && !isDeleted && (
                <DropdownMenuItem
                  onClick={() => handleRestoreReply(reply.replyId)}
                >
                  Restore Reply
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              {isDeleted ? (
                <DropdownMenuItem onClick={() => handleRestoreReview(reviewId)}>
                  Restore Review
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    handleDeleteReview(
                      reviewId,
                      (table.options.meta as any)?.adminId
                    )
                  }
                >
                  Delete Review
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reply Form</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reply</FormLabel>
                        <FormControl className="text-start">
                          <Textarea
                            placeholder="Enter your reply here."
                            className="resize-none"
                            disabled={formLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin mr-1" />{" "}
                        <p>Submitting...</p>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  //   {
  //     accessorKey: "profit",
  //     header: () => <div className="text-end">Net Revenue</div>,
  //     cell: ({ row }) => {
  //       const profit = parseFloat(row.getValue("profit"));
  //       const formatted = new Intl.NumberFormat("en-US", {
  //         style: "currency",
  //         currency: "PHP",
  //       }).format(profit);
  //       return <div className="font-medium text-end">{formatted}</div>;
  //     },
  //   },
];
