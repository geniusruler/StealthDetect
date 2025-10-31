import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;
export const AlertDialogAction = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Action>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(function AlertDialogAction({ className = "", ...props }, ref) {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none ${className}`}
      {...props}
    />
  );
});

export const AlertDialogCancel = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Cancel>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(function AlertDialogCancel({ className = "", ...props }, ref) {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md border border-border px-4 py-2 transition-colors hover:bg-muted focus:outline-none ${className}`}
      {...props}
    />
  );
});

export const AlertDialogOverlay = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className = "", ...props }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={`fixed inset-0 bg-black/50 ${className}`}
      {...props}
    />
  );
});

export const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(function AlertDialogContent({ className = "", ...props }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg focus:outline-none ${className}`}
        {...props}
      />
    </AlertDialogPortal>
  );
});

export const AlertDialogHeader = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 space-y-2 text-center sm:text-left ${className}`} {...props} />
);

export const AlertDialogFooter = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`} {...props} />
);

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className = "", ...props }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={`text-lg font-medium ${className}`}
      {...props}
    />
  );
});

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className = "", ...props }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
});
