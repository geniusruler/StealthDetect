import * as DialogPrimitive from "@radix-ui/react-dialog";
import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className = "", ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={`fixed inset-0 bg-black/50 ${className}`}
      {...props}
    />
  );
});

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DialogContent({ className = "", ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg focus:outline-none ${className}`}
        {...props}
      />
    </DialogPortal>
  );
});

export const DialogHeader = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 space-y-2 text-center sm:text-left ${className}`} {...props} />
);

export const DialogFooter = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`} {...props} />
);

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className = "", ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-medium ${className}`}
      {...props}
    />
  );
});

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className = "", ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
});
