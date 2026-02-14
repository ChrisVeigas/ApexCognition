import { useState } from "react";

export type UIComponent = {
  type: string;
  props: any;
  children?: UIComponent[] | string;
};

export interface AgentPlan {
  id: string;
  intent: string;
  layout: "centered" | "dashboard" | "split" | "fullscreen" | "sidebar";
  steps: string[];
  components: UIComponent[];
  explanation: string;
  timestamp: number;
}

export function useDeterministicGroq() {
  const [status, setStatus] = useState<"idle" | "planning" | "complete">(
    "idle",
  );
  const [history, setHistory] = useState<AgentPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const generate = async (prompt: string) => {
    setStatus("planning");
    await new Promise((r) => setTimeout(r, 600));

    const lower = prompt.toLowerCase();
    const components: UIComponent[] = [];
    const steps: string[] = ["Analyzing prompt intent"];
    let detectedLayout: AgentPlan["layout"] = "centered";

    if (
      lower.includes("login") ||
      lower.includes("sign in") ||
      lower.includes("auth") ||
      lower.includes("signin")
    ) {
      steps.push("Building Authentication block");
      components.push(
        {
          type: "Text",
          props: { className: "text-3xl font-bold mb-2" },
          children: "Welcome Back",
        },
        {
          type: "Text",
          props: { className: "text-gray-500 mb-6" },
          children: "Sign in to continue to your account",
        },
        {
          type: "Input",
          props: {
            label: "Email Address",
            placeholder: "you@example.com",
            type: "email",
          },
        },
        {
          type: "Input",
          props: {
            label: "Password",
            type: "password",
            placeholder: "••••••••",
          },
        },
        {
          type: "Stack",
          props: {
            direction: "row",
            gap: "2",
            className: "items-center justify-between my-2",
          },
          children: [
            {
              type: "Checkbox",
              props: { label: "Remember me" },
            },
            {
              type: "Text",
              props: { className: "text-sm text-blue-600 cursor-pointer" },
              children: "Forgot password?",
            },
          ],
        },
        {
          type: "Button",
          props: { className: "w-full", variant: "primary" },
          children: "Sign In",
        },
        {
          type: "Divider",
          props: { className: "my-4" },
        },
        {
          type: "Button",
          props: { className: "w-full", variant: "outline" },
          children: "Sign in with Google",
        },
      );
      detectedLayout = "centered";
    }

    if (
      lower.includes("signup") ||
      lower.includes("sign up") ||
      lower.includes("register") ||
      lower.includes("create account")
    ) {
      steps.push("Building Registration form");
      components.push(
        {
          type: "Text",
          props: { className: "text-3xl font-bold mb-2" },
          children: "Create Account",
        },
        {
          type: "Text",
          props: { className: "text-gray-500 mb-6" },
          children: "Get started with your free account",
        },
        {
          type: "Input",
          props: { label: "Full Name", placeholder: "John Doe" },
        },
        {
          type: "Input",
          props: {
            label: "Email",
            placeholder: "you@example.com",
            type: "email",
          },
        },
        {
          type: "Input",
          props: { label: "Password", type: "password" },
        },
        {
          type: "Input",
          props: { label: "Confirm Password", type: "password" },
        },
        {
          type: "Checkbox",
          props: { label: "I agree to the Terms and Privacy Policy" },
        },
        {
          type: "Button",
          props: { className: "w-full mt-4" },
          children: "Create Account",
        },
      );
      detectedLayout = "centered";
    }

    if (
      lower.includes("dashboard") ||
      lower.includes("overview") ||
      lower.includes("admin panel")
    ) {
      steps.push("Constructing Dashboard layout");
      detectedLayout = "dashboard";

      components.push(
        {
          type: "Text",
          props: { className: "text-2xl font-bold mb-6" },
          children: "Dashboard Overview",
        },
        {
          type: "Grid",
          props: { cols: "3", gap: "4", className: "mb-6" },
          children: [
            {
              type: "Card",
              props: { className: "p-4" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-500" },
                  children: "Total Users",
                },
                {
                  type: "Text",
                  props: { className: "text-3xl font-bold mt-2" },
                  children: "2,543",
                },
                {
                  type: "Badge",
                  props: { variant: "success", className: "mt-2" },
                  children: "+12.5%",
                },
              ],
            },
            {
              type: "Card",
              props: { className: "p-4" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-500" },
                  children: "Revenue",
                },
                {
                  type: "Text",
                  props: { className: "text-3xl font-bold mt-2" },
                  children: "$45.2K",
                },
                {
                  type: "Badge",
                  props: { variant: "success", className: "mt-2" },
                  children: "+8.2%",
                },
              ],
            },
            {
              type: "Card",
              props: { className: "p-4" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-500" },
                  children: "Active Now",
                },
                {
                  type: "Text",
                  props: { className: "text-3xl font-bold mt-2" },
                  children: "189",
                },
                {
                  type: "Badge",
                  props: { variant: "warning", className: "mt-2" },
                  children: "-2.4%",
                },
              ],
            },
          ],
        },
        {
          type: "Chart",
          props: { type: "area", className: "h-[300px] mb-6" },
        },
      );
    }

    if (
      lower.includes("chart") ||
      lower.includes("graph") ||
      lower.includes("analytics") ||
      lower.includes("visualization") ||
      lower.includes("data")
    ) {
      steps.push("Adding Data Visualization");

      const chartType = lower.includes("pie")
        ? "pie"
        : lower.includes("line")
          ? "line"
          : lower.includes("area")
            ? "area"
            : "bar";

      components.push(
        {
          type: "Text",
          props: { className: "text-xl font-bold mb-4" },
          children: "Analytics Overview",
        },
        {
          type: "Chart",
          props: { type: chartType, className: "h-[250px] mb-4" },
        },
        {
          type: "Stack",
          props: { direction: "row", gap: "2" },
          children: [
            {
              type: "Badge",
              props: { variant: "outline" },
              children: "Live Data",
            },
            {
              type: "Badge",
              props: { variant: "outline" },
              children: "Updated 2m ago",
            },
          ],
        },
      );
    }

    if (
      lower.includes("table") ||
      lower.includes("list") ||
      lower.includes("users") ||
      lower.includes("customers") ||
      lower.includes("data grid")
    ) {
      steps.push("Building Data Table");
      components.push(
        {
          type: "Stack",
          props: {
            direction: "row",
            gap: "2",
            className: "mb-4 justify-between items-center",
          },
          children: [
            {
              type: "Text",
              props: { className: "text-xl font-bold" },
              children: "User List",
            },
            {
              type: "Button",
              props: { variant: "primary" },
              children: "+ Add User",
            },
          ],
        },
        {
          type: "Input",
          props: { placeholder: "Search users...", className: "mb-4" },
        },
        {
          type: "Table",
          props: {
            headers: ["Name", "Email", "Role", "Status"],
            rows: [
              ["John Doe", "john@example.com", "Admin", "Active"],
              ["Jane Smith", "jane@example.com", "User", "Active"],
              ["Bob Johnson", "bob@example.com", "Manager", "Inactive"],
            ],
          },
        },
      );
    }

    if (
      lower.includes("form") ||
      lower.includes("contact") ||
      lower.includes("submit") ||
      lower.includes("survey")
    ) {
      steps.push("Generating Form fields");
      components.push(
        {
          type: "Text",
          props: { className: "text-2xl font-bold mb-4" },
          children: "Contact Form",
        },
        {
          type: "Input",
          props: { label: "Name", placeholder: "Your name" },
        },
        {
          type: "Input",
          props: {
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
          },
        },
        {
          type: "Textarea",
          props: {
            label: "Message",
            placeholder: "Tell us what you think...",
            rows: 4,
          },
        },
        {
          type: "Button",
          props: { className: "w-full mt-4" },
          children: "Send Message",
        },
      );
    }

    if (
      lower.includes("settings") ||
      lower.includes("preferences") ||
      lower.includes("config") ||
      lower.includes("profile")
    ) {
      steps.push("Adding Configuration panel");
      components.push(
        {
          type: "Text",
          props: { className: "text-2xl font-bold mb-6" },
          children: "Settings",
        },
        {
          type: "Card",
          props: { className: "p-4 mb-4" },
          children: [
            {
              type: "Text",
              props: { className: "font-semibold mb-3" },
              children: "Notifications",
            },
            { type: "Switch", props: { label: "Email notifications" } },
            { type: "Switch", props: { label: "Push notifications" } },
            { type: "Switch", props: { label: "SMS alerts" } },
          ],
        },
        {
          type: "Card",
          props: { className: "p-4 mb-4" },
          children: [
            {
              type: "Text",
              props: { className: "font-semibold mb-3" },
              children: "Display",
            },
            {
              type: "Slider",
              props: { label: "Brightness", defaultValue: [70] },
            },
            {
              type: "Select",
              props: { label: "Theme", options: ["Light", "Dark", "Auto"] },
            },
          ],
        },
        {
          type: "Button",
          props: { variant: "primary" },
          children: "Save Changes",
        },
      );
    }

    if (
      lower.includes("product") ||
      lower.includes("shop") ||
      lower.includes("store") ||
      lower.includes("cart") ||
      lower.includes("checkout")
    ) {
      steps.push("Building E-commerce interface");
      detectedLayout = "split";

      components.push({
        type: "Grid",
        props: { cols: "2", gap: "6" },
        children: [
          {
            type: "Stack",
            props: { direction: "column", gap: "4" },
            children: [
              {
                type: "Image",
                props: { src: "/product.jpg", className: "rounded-lg" },
              },
              {
                type: "Grid",
                props: { cols: "4", gap: "2" },
                children: [
                  {
                    type: "Image",
                    props: { src: "/thumb1.jpg", className: "rounded" },
                  },
                  {
                    type: "Image",
                    props: { src: "/thumb2.jpg", className: "rounded" },
                  },
                  {
                    type: "Image",
                    props: { src: "/thumb3.jpg", className: "rounded" },
                  },
                  {
                    type: "Image",
                    props: { src: "/thumb4.jpg", className: "rounded" },
                  },
                ],
              },
            ],
          },
          {
            type: "Stack",
            props: { direction: "column", gap: "4" },
            children: [
              {
                type: "Text",
                props: { className: "text-3xl font-bold" },
                children: "Premium Headphones",
              },
              {
                type: "Text",
                props: { className: "text-2xl text-blue-600 font-bold" },
                children: "$299.99",
              },
              {
                type: "Text",
                props: { className: "text-gray-600" },
                children:
                  "High-fidelity wireless headphones with active noise cancellation",
              },
              {
                type: "Badge",
                props: { variant: "success" },
                children: "In Stock",
              },
              { type: "Divider", props: {} },
              {
                type: "Select",
                props: { label: "Color", options: ["Black", "White", "Blue"] },
              },
              {
                type: "Select",
                props: {
                  label: "Quantity",
                  options: ["1", "2", "3", "4", "5"],
                },
              },
              {
                type: "Button",
                props: { className: "w-full", variant: "primary" },
                children: "Add to Cart",
              },
              {
                type: "Button",
                props: { className: "w-full", variant: "outline" },
                children: "Buy Now",
              },
            ],
          },
        ],
      });
    }

    if (
      lower.includes("pricing") ||
      lower.includes("plans") ||
      lower.includes("subscription") ||
      lower.includes("tier")
    ) {
      steps.push("Creating Pricing table");
      components.push(
        {
          type: "Text",
          props: { className: "text-3xl font-bold text-center mb-2" },
          children: "Choose Your Plan",
        },
        {
          type: "Text",
          props: { className: "text-gray-500 text-center mb-8" },
          children: "Select the perfect plan for your needs",
        },
        {
          type: "Grid",
          props: { cols: "3", gap: "6" },
          children: [
            {
              type: "Card",
              props: { className: "p-6 text-center" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-xl font-bold mb-2" },
                  children: "Starter",
                },
                {
                  type: "Text",
                  props: { className: "text-4xl font-bold my-4" },
                  children: "$9",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-4" },
                  children: "per month",
                },
                {
                  type: "Button",
                  props: { className: "w-full mb-4", variant: "outline" },
                  children: "Get Started",
                },
                { type: "Divider", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ 10 Projects",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ Basic Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ 5GB Storage",
                },
              ],
            },
            {
              type: "Card",
              props: { className: "p-6 text-center border-2 border-blue-500" },
              children: [
                {
                  type: "Badge",
                  props: { variant: "primary", className: "mb-2" },
                  children: "Popular",
                },
                {
                  type: "Text",
                  props: { className: "text-xl font-bold mb-2" },
                  children: "Pro",
                },
                {
                  type: "Text",
                  props: { className: "text-4xl font-bold my-4" },
                  children: "$29",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-4" },
                  children: "per month",
                },
                {
                  type: "Button",
                  props: { className: "w-full mb-4", variant: "primary" },
                  children: "Get Started",
                },
                { type: "Divider", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ Unlimited Projects",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ Priority Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ 50GB Storage",
                },
              ],
            },
            {
              type: "Card",
              props: { className: "p-6 text-center" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-xl font-bold mb-2" },
                  children: "Enterprise",
                },
                {
                  type: "Text",
                  props: { className: "text-4xl font-bold my-4" },
                  children: "$99",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-4" },
                  children: "per month",
                },
                {
                  type: "Button",
                  props: { className: "w-full mb-4", variant: "outline" },
                  children: "Contact Sales",
                },
                { type: "Divider", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ Everything in Pro",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ 24/7 Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm text-gray-600" },
                  children: "✓ Unlimited Storage",
                },
              ],
            },
          ],
        },
      );
    }

    if (
      lower.includes("profile") ||
      lower.includes("account") ||
      lower.includes("user info")
    ) {
      steps.push("Building Profile view");
      components.push(
        {
          type: "Stack",
          props: { direction: "row", gap: "4", className: "items-center mb-6" },
          children: [
            { type: "Avatar", props: { size: "lg", src: "/avatar.jpg" } },
            {
              type: "Stack",
              props: { direction: "column", gap: "1" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-2xl font-bold" },
                  children: "John Doe",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500" },
                  children: "john.doe@example.com",
                },
              ],
            },
          ],
        },
        {
          type: "Tabs",
          props: {
            tabs: ["Personal Info", "Security", "Billing"],
          },
        },
        {
          type: "Card",
          props: { className: "p-6 mt-4" },
          children: [
            {
              type: "Input",
              props: { label: "Full Name", defaultValue: "John Doe" },
            },
            {
              type: "Input",
              props: { label: "Email", defaultValue: "john.doe@example.com" },
            },
            {
              type: "Input",
              props: { label: "Phone", defaultValue: "+1 234 567 8900" },
            },
            { type: "Textarea", props: { label: "Bio", rows: 3 } },
            {
              type: "Button",
              props: { className: "mt-4" },
              children: "Save Changes",
            },
          ],
        },
      );
    }

    if (
      lower.includes("notification") ||
      lower.includes("alert") ||
      lower.includes("message") ||
      lower.includes("inbox")
    ) {
      steps.push("Adding Notification center");
      components.push(
        {
          type: "Text",
          props: { className: "text-2xl font-bold mb-4" },
          children: "Notifications",
        },
        {
          type: "Stack",
          props: { direction: "column", gap: "3" },
          children: [
            {
              type: "Alert",
              props: { variant: "info" },
              children: "New feature: Dark mode is now available!",
            },
            {
              type: "Alert",
              props: { variant: "success" },
              children: "Your payment was processed successfully",
            },
            {
              type: "Alert",
              props: { variant: "warning" },
              children: "Your subscription expires in 7 days",
            },
          ],
        },
      );
    }

    if (
      lower.includes("search") ||
      lower.includes("filter") ||
      lower.includes("find")
    ) {
      steps.push("Building Search interface");
      components.push(
        {
          type: "Stack",
          props: { direction: "row", gap: "2", className: "mb-4" },
          children: [
            {
              type: "Input",
              props: { placeholder: "Search...", className: "flex-1" },
            },
            { type: "Button", props: {}, children: "Search" },
          ],
        },
        {
          type: "Stack",
          props: { direction: "row", gap: "2", className: "mb-4" },
          children: [
            {
              type: "Select",
              props: {
                placeholder: "Category",
                options: ["All", "Tech", "Design", "Business"],
              },
            },
            {
              type: "Select",
              props: {
                placeholder: "Date",
                options: ["Any time", "Today", "This week"],
              },
            },
            {
              type: "Button",
              props: { variant: "outline" },
              children: "Clear Filters",
            },
          ],
        },
      );
    }

    if (components.length === 0) {
      steps.push("No specific keywords detected - generating generic layout");
      components.push(
        {
          type: "Text",
          props: { className: "text-2xl font-bold mb-4" },
          children: "Generated Layout",
        },
        {
          type: "Text",
          props: { className: "text-gray-600 mb-4" },
          children: `Based on: "${prompt}"`,
        },
        {
          type: "Alert",
          props: { variant: "info" },
          children:
            "Try keywords like: login, dashboard, form, chart, table, pricing, profile",
        },
      );
    }

    const finalPlan: AgentPlan = {
      id: `gen-${Date.now()}`,
      intent: prompt,
      layout: detectedLayout,
      steps,
      explanation: `Generated ${components.length} components: ${steps.join(" → ")}`,
      timestamp: Date.now(),
      components: [
        {
          type: "Card",
          props: {
            className:
              detectedLayout === "centered"
                ? "p-6 w-full max-w-lg mx-auto"
                : "p-6 w-full",
          },
          children: [
            {
              type: "Stack",
              props: { direction: "column", gap: "4" },
              children: components,
            },
          ],
        },
      ],
    };

    const newHistory = [...history.slice(0, currentIndex + 1), finalPlan];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setStatus("complete");
  };

  return {
    generate,
    status,
    plan: currentIndex >= 0 ? history[currentIndex] : null,
    undo: () => currentIndex > 0 && setCurrentIndex(currentIndex - 1),
    redo: () =>
      currentIndex < history.length - 1 && setCurrentIndex(currentIndex + 1),
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
