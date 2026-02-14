import React from "react";
import { cn } from "@/lib/utils";
import { UIComponent } from "@/hooks/useGroq";

export function Box({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("block", className)} {...props}>
      {children}
    </div>
  );
}

export function Stack({
  children,
  direction = "column",
  gap = "4",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  direction?: "row" | "column";
  gap?: string;
}) {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        gap === "2" && "gap-2",
        gap === "4" && "gap-4",
        gap === "6" && "gap-6",
        gap === "8" && "gap-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  variant = "p",
  className,
  ...props
}: React.ComponentProps<"p"> & {
  variant?: "h1" | "h2" | "h3" | "p" | "muted" | "small";
}) {
  const styles = {
    h1: "text-4xl font-bold tracking-tight text-foreground",
    h2: "text-2xl font-semibold tracking-tight text-foreground",
    h3: "text-xl font-semibold text-foreground",
    p: "text-base text-foreground leading-7",
    muted: "text-sm text-muted-foreground",
    small: "text-xs font-medium leading-none",
  };

  const Component = variant.startsWith("h") ? (variant as any) : "p";

  return (
    <Component className={cn(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
}

export function Card({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "default",
  className,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        variant === "secondary" &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "outline" &&
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        variant === "link" && "text-primary underline-offset-4 hover:underline",
        size === "default" && "h-9 px-4 py-2",
        size === "sm" && "h-8 px-3 text-xs",
        size === "lg" && "h-11 px-8",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & { label?: string }) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Label({
  children,
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function Textarea({
  label,
  className,
  rows = 3,
  ...props
}: React.ComponentProps<"textarea"> & { label?: string }) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-foreground leading-none">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "flex min-h-15 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "success" | "warning" | "outline" | "primary";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variant === "default" && "bg-secondary text-secondary-foreground",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "success" && "bg-green-50 text-green-700 ring-green-600/20",
        variant === "warning" &&
          "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
        variant === "outline" &&
          "bg-background text-foreground ring-border border",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Separator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("shrink-0 bg-border h-px w-full my-2", className)}
      {...props}
    />
  );
}

export function Avatar({
  src,
  fallback = "?",
  size = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  src?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="Avatar" className="aspect-square h-full w-full" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
          {fallback.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & { label?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
          className,
        )}
        {...props}
      />
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
    </div>
  );
}

export function Switch({
  label,
  className,
  ...props
}: React.ComponentProps<"button"> & { label?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-input",
          className,
        )}
        {...props}
      >
        <span className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-0" />
      </button>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
    </div>
  );
}

export function Table({
  headers,
  rows,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  headers?: string[];
  rows?: string[][];
}) {
  return (
    <div
      className={cn("w-full overflow-auto rounded-md border", className)}
      {...props}
    >
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {headers?.map((header, i) => (
              <th
                key={i}
                className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr
              key={i}
              className="border-b transition-colors hover:bg-muted/50"
            >
              {row.map((cell, j) => (
                <td key={j} className="p-4 align-middle text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Chart({
  type = "bar",
  className,
  ...props
}: React.ComponentProps<"div"> & { type?: "bar" | "line" | "pie" | "area" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border",
        className,
      )}
      {...props}
    >
      <div className="text-center p-8">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-sm text-muted-foreground font-medium">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Visualization placeholder
        </p>
      </div>
    </div>
  );
}

export function Alert({
  children,
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "warning" | "error" | "success" | "info";
}) {
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        variant === "default" && "bg-background text-foreground",
        variant === "warning" &&
          "bg-yellow-50 text-yellow-900 border-yellow-200",
        variant === "error" && "bg-red-50 text-red-900 border-red-200",
        variant === "success" && "bg-green-50 text-green-900 border-green-200",
        variant === "info" && "bg-blue-50 text-blue-900 border-blue-200",
        className,
      )}
      {...props}
    >
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

export function Sidebar({
  children,
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background p-4 space-y-2",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function NavigationMenu({
  children,
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav className={cn("flex items-center gap-4 p-4", className)} {...props}>
      {children}
    </nav>
  );
}

export function Grid({
  children,
  cols = "1",
  gap = "4",
  className,
  ...props
}: React.ComponentProps<"div"> & { cols?: string; gap?: string }) {
  return (
    <div
      className={cn("grid", `grid-cols-${cols}`, `gap-${gap}`, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Tabs({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsList({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Select({
  options = [],
  placeholder,
  className,
  ...props
}: React.ComponentProps<"select"> & {
  options?: string[];
  placeholder?: string;
}) {
  return (
    <select
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function RadioGroup({
  options = [],
  className,
  ...props
}: React.ComponentProps<"div"> & { options?: string[] }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`radio-${i}`}
            name="radio-group"
            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor={`radio-${i}`}
            className="text-sm font-medium text-foreground"
          >
            {opt}
          </label>
        </div>
      ))}
    </div>
  );
}

export function Pagination({
  totalPages = 1,
  currentPage = 1,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  totalPages?: number;
  currentPage?: number;
}) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Button variant="outline" size="sm">
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="outline" size="sm">
        Next
      </Button>
    </div>
  );
}

export function InputGroup({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}

// Component Renderer
export function ComponentRenderer({ component }: { component: UIComponent }) {
  const { type, props, children } = component;

  const renderedChildren = Array.isArray(children)
    ? children.map((child, i) => (
        <ComponentRenderer key={i} component={child} />
      ))
    : children;

  switch (type) {
    case "Box":
      return <Box {...props}>{renderedChildren}</Box>;
    case "Stack":
      return <Stack {...props}>{renderedChildren}</Stack>;
    case "Grid":
      return <Grid {...props}>{renderedChildren}</Grid>;
    case "Text":
      return <Text {...props}>{renderedChildren}</Text>;
    case "Button":
      return <Button {...props}>{renderedChildren}</Button>;
    case "Input":
      return <Input {...props} />;
    case "Label":
      return <Label {...props}>{renderedChildren}</Label>;
    case "Textarea":
      return <Textarea {...props} />;
    case "Card":
      return <Card {...props}>{renderedChildren}</Card>;
    case "Badge":
      return <Badge {...props}>{renderedChildren}</Badge>;
    case "Separator":
      return <Separator {...props} />;
    case "Avatar":
      return <Avatar {...props} />;
    case "Checkbox":
      return <Checkbox {...props} />;
    case "Switch":
      return <Switch {...props} />;
    case "Table":
      return <Table {...props} />;
    case "Chart":
      return <Chart {...props} />;
    case "Alert":
      return <Alert {...props}>{renderedChildren}</Alert>;
    case "Sidebar":
      return <Sidebar {...props}>{renderedChildren}</Sidebar>;
    case "NavigationMenu":
      return <NavigationMenu {...props}>{renderedChildren}</NavigationMenu>;
    case "Tabs":
      return <Tabs {...props}>{renderedChildren}</Tabs>;
    case "TabsList":
      return <TabsList {...props}>{renderedChildren}</TabsList>;
    case "TabsTrigger":
      return <TabsTrigger {...props}>{renderedChildren}</TabsTrigger>;
    case "TabsContent":
      return <TabsContent {...props}>{renderedChildren}</TabsContent>;
    case "Select":
      return <Select {...props} />;
    case "RadioGroup":
      return <RadioGroup {...props} />;
    case "Pagination":
      return <Pagination {...props} />;
    case "InputGroup":
      return <InputGroup {...props}>{renderedChildren}</InputGroup>;
    default:
      return (
        <div className="p-2 border border-dashed border-red-500 rounded text-red-500 text-sm">
          Unknown: {type}
        </div>
      );
  }
}
