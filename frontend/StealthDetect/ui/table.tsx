import type {
  DetailedHTMLProps,
  HTMLAttributes,
  TableHTMLAttributes,
} from "react";

type TableProps = DetailedHTMLProps<
  TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;

type TableSectionProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

type TableRowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

type TableCellProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = "", ...props }: TableSectionProps) {
  return <thead className={`bg-muted ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }: TableSectionProps) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className = "", ...props }: TableRowProps) {
  return <tr className={`border-b border-border/40 ${className}`} {...props} />;
}

export function TableHead({ className = "", ...props }: TableCellProps) {
  return (
    <th
      className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }: TableCellProps) {
  return (
    <td className={`px-4 py-2 align-middle ${className}`} {...props} />
  );
}

export function TableFooter({ className = "", ...props }: TableSectionProps) {
  return <tfoot className={`bg-muted ${className}`} {...props} />;
}

export default Table;