import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

type ContextMenuContentProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Content
>;

export const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(function ContextMenuContent({ className = "", ...props }, ref) {
  return (
    <ContextMenuPrimitive.Content
      ref={ref}
      className={`min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none ${className}`}
      {...props}
    />
  );
});

type ContextMenuItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> & {
  inset?: boolean;
};

export const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(function ContextMenuItem({ className = "", inset, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={`flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${inset ? "pl-8" : ""} ${className}`}
      {...props}
    />
  );
});

export const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(function ContextMenuCheckboxItem({ className = "", children, checked, ...props }, ref) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={`flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      checked={checked}
      {...props}
    >
      <span className="w-3 text-center">
        <ContextMenuPrimitive.ItemIndicator>✓</ContextMenuPrimitive.ItemIndicator>
      </span>
      <span className="flex-1 truncate">{children}</span>
    </ContextMenuPrimitive.CheckboxItem>
  );
});

export const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(function ContextMenuRadioItem({ className = "", children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={`flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      <span className="w-3 text-center">
        <ContextMenuPrimitive.ItemIndicator>●</ContextMenuPrimitive.ItemIndicator>
      </span>
      <span className="flex-1 truncate">{children}</span>
    </ContextMenuPrimitive.RadioItem>
  );
});

type ContextMenuLabelProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Label
> & {
  inset?: boolean;
};

export const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ContextMenuLabelProps
>(function ContextMenuLabel({ className = "", inset, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={`px-2 py-1 text-xs font-semibold text-muted-foreground ${inset ? "pl-8" : ""} ${className}`}
      {...props}
    />
  );
});

export const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(function ContextMenuSeparator({ className = "", ...props }, ref) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={`mx-1 my-1 h-px bg-border ${className}`}
      {...props}
    />
  );
});

type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> & {
  inset?: boolean;
};

export const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ContextMenuSubTriggerProps
>(function ContextMenuSubTrigger({ className = "", inset, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={`flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 ${inset ? "pl-8" : ""} ${className}`}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <span aria-hidden>›</span>
    </ContextMenuPrimitive.SubTrigger>
  );
});

export const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(function ContextMenuSubContent({ className = "", ...props }, ref) {
  return (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={`min-w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none ${className}`}
      {...props}
    />
  );
});

export const ContextMenuShortcut = ({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={`ml-auto text-xs text-muted-foreground ${className}`} {...props} />
);
