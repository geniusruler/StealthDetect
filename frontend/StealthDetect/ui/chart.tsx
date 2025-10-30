"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  TooltipProps,
  LegendProps,
} from "recharts";
import { cn } from "./utils";

// theme mapping
const THEMES = { light: "", dark: ".dark" } as const;

// ---------------------------
// Type Definitions
// ---------------------------

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within a <ChartContainer />");
  return ctx;
}

// ---------------------------
// Chart Container
// ---------------------------

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ---------------------------
// Chart Style
// ---------------------------

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.theme || cfg.color
  );

  if (!colorConfig.length) return null;

  const styleString = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] || item.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}`
    )
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: styleString }} />;
};

// ---------------------------
// Tooltip
// ---------------------------

const ChartTooltip = RechartsTooltip;

interface CustomTooltipProps extends TooltipProps<number, string> {
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  formatter?: (
    value: number,
    name: string,
    item: any,
    index: number,
    payload: any
  ) => React.ReactNode;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: CustomTooltipProps & React.ComponentProps<"div">) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  const [item] = payload;
  const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);

  const tooltipLabel =
    hideLabel || !label
      ? null
      : labelFormatter
      ? labelFormatter(label, payload)
      : itemConfig?.label || label;

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {tooltipLabel && (
        <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div>
      )}
      <div className="grid gap-1.5">
        {payload.map((p, index) => {
          const key = `${nameKey || p.name || p.dataKey || "value"}`;
          const cfg = getPayloadConfigFromPayload(config, p, key);
          const indicatorColor = color || p.payload?.fill || p.color;

          return (
            <div
              key={p.dataKey ?? index}
              className={cn(
                "flex w-full flex-wrap items-center gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5"
              )}
            >
              {!hideIndicator && (
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: indicatorColor,
                    borderColor: indicatorColor,
                  }}
                />
              )}
              <div className="flex flex-1 justify-between leading-none items-center">
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">
                    {cfg?.label || p.name}
                  </span>
                </div>
                {p.value !== undefined && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {p.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------
// Legend
// ---------------------------

const ChartLegend = RechartsLegend;

interface CustomLegendProps extends LegendProps {
  hideIcon?: boolean;
  nameKey?: string;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: CustomLegendProps & React.ComponentProps<"div">) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, i) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return (
          <div
            key={i}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          >
            {!hideIcon ? (
              itemConfig?.icon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )
            ) : null}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------
// Helper
// ---------------------------

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
) {
  if (!payload || typeof payload !== "object") return undefined;

  const payloadInner =
    typeof payload.payload === "object" ? payload.payload : undefined;

  let configLabelKey = key;

  if (typeof payload[key] === "string") configLabelKey = payload[key];
  else if (payloadInner && typeof payloadInner[key] === "string")
    configLabelKey = payloadInner[key];

  return config[configLabelKey] ?? config[key];
}

// ---------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
