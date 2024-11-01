"use client";

import * as React from "react";
import { MoreVertical, Check, X, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Order } from "@/types";
import { toast } from "../ui/use-toast";
import {
  createOrderAction,
  deleteOrderAction,
  updateOrderAction,
} from "@/actions/order-actions";
import { useAction } from "next-safe-action/hooks";

interface OrderActionMenuProps {
  order: Order;
}

export function OrderActionMenu({ order }: OrderActionMenuProps) {
  const [open, setOpen] = React.useState(false);

  const { execute: updateOrder } = useAction(updateOrderAction, {
    onSuccess: async () => {
      toast({
        title: "Order Updated",
        description: "The order was successfully updated!",
      });
      setOpen(false);
    },
    onError: async ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Order Update Failed!",
          variant: "destructive",
          description: error.serverError,
        });
      }
    },
  });

  const { execute: deleteOrder, isExecuting: isDeletingOrder } = useAction(
    deleteOrderAction,
    {
      onSuccess: async () => {
        toast({
          title: "Order Deleted",
          description: "The order was successfully deleted!",
        });
        setOpen(false);
      },
      onError: async ({ error }) => {
        if (error.serverError) {
          toast({
            title: "Order Deletion Failed!",
            variant: "destructive",
            description: error.serverError,
          });
        }
      },
    }
  );

  const handleMarkDelivered = async () => {
    updateOrder({ ...order, id: order.Id, fulfillmentStatus: "DELIVERED" });
  };

  const handleCancelOrder = async () => {
    updateOrder({ ...order, id: order.Id, fulfillmentStatus: "CANCELED" });
  };

  const handleDeleteOrder = async () => {
    console.log(`Deleting order ${order.Id}`);
    deleteOrder({ id: order.Id });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleMarkDelivered}>
          <Check className="mr-2 h-4 w-4" />
          <span>Mark Delivered</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCancelOrder}>
          <X className="mr-2 h-4 w-4" />
          <span>Cancel Order</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteOrder}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
