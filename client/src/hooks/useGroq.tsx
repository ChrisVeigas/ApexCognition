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

async function callGroq(prompt: string): Promise<UIComponent[]> {
  const response = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Groq API failed");
  }

  const data = await response.json();

  // Parse the AI response and extract components
  try {
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return parsed.components || [];
  } catch {
    return [];
  }
}

export function useDeterministicGroq() {
  const [status, setStatus] = useState<"idle" | "planning" | "complete">(
    "idle",
  );
  const [history, setHistory] = useState<AgentPlan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const generate = async (prompt: string) => {
    setStatus("planning");
    await new Promise((r) => setTimeout(r, 300));

    const lower = prompt.toLowerCase();
    const components: UIComponent[] = [];
    const steps: string[] = ["Analyzing prompt intent"];
    let detectedLayout: AgentPlan["layout"] = "centered";
    let usedDeterministic = false;

    // ==========================================
    // AUTHENTICATION & LOGIN
    // ==========================================
    if (
      lower.includes("login") ||
      lower.includes("sign in") ||
      lower.includes("signin") ||
      lower.includes("auth")
    ) {
      usedDeterministic = true;
      steps.push("Building authentication interface");
      detectedLayout = "centered";

      const hasNav = lower.includes("nav") || lower.includes("header");
      const hasSocial =
        lower.includes("social") ||
        lower.includes("google") ||
        lower.includes("oauth");
      const hasRemember = !lower.includes("simple");

      if (hasNav) {
        components.push({
          type: "NavigationMenu",
          props: { className: "mb-8" },
          children: [
            { type: "Button", props: { variant: "ghost" }, children: "Home" },
            { type: "Button", props: { variant: "ghost" }, children: "About" },
            {
              type: "Button",
              props: { variant: "outline" },
              children: "Sign Up",
            },
          ],
        });
      }

      components.push({
        type: "Card",
        props: { className: "w-full max-w-md mx-auto p-8" },
        children: [
          { type: "Avatar", props: { className: "mx-auto mb-4", size: "lg" } },
          {
            type: "Text",
            props: { className: "text-3xl font-bold text-center mb-2" },
            children: "Welcome Back",
          },
          {
            type: "Text",
            props: { className: "text-gray-500 text-center mb-6" },
            children: "Sign in to continue",
          },
          { type: "Label", props: { htmlFor: "email" }, children: "Email" },
          {
            type: "Input",
            props: {
              id: "email",
              type: "email",
              placeholder: "you@example.com",
              className: "mb-4",
            },
          },
          {
            type: "Label",
            props: { htmlFor: "password" },
            children: "Password",
          },
          {
            type: "Input",
            props: {
              id: "password",
              type: "password",
              placeholder: "••••••••",
              className: "mb-2",
            },
          },
        ],
      });

      if (hasRemember) {
        const lastComponent = components[components.length - 1];
        if (Array.isArray(lastComponent.children)) {
          lastComponent.children.push({
            type: "Stack",
            props: {
              direction: "row",
              className: "justify-between items-center mb-4",
            },
            children: [
              { type: "Checkbox", props: { label: "Remember me" } },
              {
                type: "Button",
                props: { variant: "link", size: "sm" },
                children: "Forgot password?",
              },
            ],
          });
        }
      }

      const lastCard = components[components.length - 1];
      if (Array.isArray(lastCard.children)) {
        lastCard.children.push({
          type: "Button",
          props: { className: "w-full mb-4" },
          children: "Sign In",
        });
      }

      if (hasSocial) {
        const lastCard = components[components.length - 1];
        if (Array.isArray(lastCard.children)) {
          lastCard.children.push(
            { type: "Separator", props: { className: "my-4" } },
            {
              type: "Text",
              props: { className: "text-center text-sm text-gray-500 mb-3" },
              children: "Or continue with",
            },
            {
              type: "Stack",
              props: { direction: "row", gap: "2" },
              children: [
                {
                  type: "Button",
                  props: { variant: "outline", className: "flex-1" },
                  children: "Google",
                },
                {
                  type: "Button",
                  props: { variant: "outline", className: "flex-1" },
                  children: "GitHub",
                },
              ],
            },
          );
        }
      }
    }

    // ==========================================
    // DASHBOARD
    // ==========================================
    else if (lower.includes("dashboard") || lower.includes("admin panel")) {
      usedDeterministic = true;
      steps.push("Constructing dashboard layout");
      detectedLayout = "dashboard";

      const hasSidebar =
        lower.includes("sidebar") || lower.includes("side menu");
      const hasCharts =
        lower.includes("chart") ||
        lower.includes("analytics") ||
        lower.includes("graph");
      const hasTable =
        lower.includes("table") ||
        lower.includes("list") ||
        lower.includes("users");

      if (hasSidebar) {
        components.push({
          type: "Stack",
          props: { direction: "row", className: "h-screen" },
          children: [
            {
              type: "Sidebar",
              props: { className: "w-64" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-xl font-bold p-4" },
                  children: "Dashboard",
                },
                { type: "Separator", props: {} },
                {
                  type: "Button",
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start",
                  },
                  children: "📊 Overview",
                },
                {
                  type: "Button",
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start",
                  },
                  children: "👥 Users",
                },
                {
                  type: "Button",
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start",
                  },
                  children: "📈 Analytics",
                },
                {
                  type: "Button",
                  props: {
                    variant: "ghost",
                    className: "w-full justify-start",
                  },
                  children: "⚙️ Settings",
                },
              ],
            },
            {
              type: "Stack",
              props: {
                direction: "column",
                className: "flex-1 p-6 overflow-auto",
              },
              children: [],
            },
          ],
        });

        // ✅ Safe access to mainArea
        const stackContainer = components[0];
        if (
          Array.isArray(stackContainer.children) &&
          stackContainer.children[1] &&
          Array.isArray(stackContainer.children[1].children)
        ) {
          const mainArea = stackContainer.children[1].children as UIComponent[];

          mainArea.push({
            type: "Text",
            props: { className: "text-3xl font-bold mb-6" },
            children: "Dashboard Overview",
          });

          // Stats Cards
          mainArea.push({
            type: "Grid",
            props: { cols: "4", gap: "4", className: "mb-6" },
            children: [
              {
                type: "Card",
                props: { className: "p-6" },
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
                props: { className: "p-6" },
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
                props: { className: "p-6" },
                children: [
                  {
                    type: "Text",
                    props: { className: "text-sm text-gray-500" },
                    children: "Orders",
                  },
                  {
                    type: "Text",
                    props: { className: "text-3xl font-bold mt-2" },
                    children: "1,234",
                  },
                  {
                    type: "Badge",
                    props: { variant: "warning", className: "mt-2" },
                    children: "-2.4%",
                  },
                ],
              },
              {
                type: "Card",
                props: { className: "p-6" },
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
                    props: { variant: "default", className: "mt-2" },
                    children: "Live",
                  },
                ],
              },
            ],
          });

          if (hasCharts) {
            mainArea.push({
              type: "Card",
              props: { className: "p-6 mb-6" },
              children: [
                {
                  type: "Text",
                  props: { className: "text-xl font-semibold mb-4" },
                  children: "Revenue Overview",
                },
                {
                  type: "Chart",
                  props: { type: "area", className: "h-[300px]" },
                },
              ],
            });
          }

          if (hasTable) {
            mainArea.push({
              type: "Card",
              props: { className: "p-6" },
              children: [
                {
                  type: "Stack",
                  props: {
                    direction: "row",
                    className: "justify-between items-center mb-4",
                  },
                  children: [
                    {
                      type: "Text",
                      props: { className: "text-xl font-semibold" },
                      children: "Recent Users",
                    },
                    {
                      type: "Button",
                      props: { size: "sm" },
                      children: "+ Add User",
                    },
                  ],
                },
                {
                  type: "Table",
                  props: {
                    headers: ["Name", "Email", "Role", "Status"],
                    rows: [
                      ["John Doe", "john@example.com", "Admin", "Active"],
                      ["Jane Smith", "jane@example.com", "User", "Active"],
                      ["Bob Wilson", "bob@example.com", "Manager", "Inactive"],
                    ],
                  },
                },
              ],
            });
          }
        }
      } else {
        // Simple dashboard without sidebar
        components.push(
          {
            type: "Text",
            props: { className: "text-3xl font-bold mb-6" },
            children: "Dashboard",
          },
          {
            type: "Grid",
            props: { cols: "3", gap: "4", className: "mb-6" },
            children: [
              {
                type: "Card",
                props: { className: "p-6" },
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
                ],
              },
              {
                type: "Card",
                props: { className: "p-6" },
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
                ],
              },
              {
                type: "Card",
                props: { className: "p-6" },
                children: [
                  {
                    type: "Text",
                    props: { className: "text-sm text-gray-500" },
                    children: "Active",
                  },
                  {
                    type: "Text",
                    props: { className: "text-3xl font-bold mt-2" },
                    children: "189",
                  },
                ],
              },
            ],
          },
          { type: "Chart", props: { type: "bar", className: "h-[300px]" } },
        );
      }
    }

    // ==========================================
    // FORMS & CONTACT
    // ==========================================
    else if (lower.includes("form") || lower.includes("contact")) {
      usedDeterministic = true;
      steps.push("Building form interface");

      const isMultiStep =
        lower.includes("multi") ||
        lower.includes("wizard") ||
        lower.includes("step");
      const isAdvanced =
        lower.includes("advanced") || lower.includes("complex");

      if (isMultiStep) {
        components.push(
          {
            type: "Text",
            props: { className: "text-2xl font-bold mb-6" },
            children: "Multi-Step Form",
          },
          {
            type: "Tabs",
            props: { defaultValue: "step1" },
            children: [
              {
                type: "TabsList",
                props: {},
                children: [
                  {
                    type: "TabsTrigger",
                    props: { value: "step1" },
                    children: "Personal Info",
                  },
                  {
                    type: "TabsTrigger",
                    props: { value: "step2" },
                    children: "Address",
                  },
                  {
                    type: "TabsTrigger",
                    props: { value: "step3" },
                    children: "Confirmation",
                  },
                ],
              },
              {
                type: "TabsContent",
                props: { value: "step1" },
                children: [
                  { type: "Label", props: {}, children: "Full Name" },
                  {
                    type: "Input",
                    props: { placeholder: "John Doe", className: "mb-4" },
                  },
                  { type: "Label", props: {}, children: "Email" },
                  {
                    type: "Input",
                    props: { type: "email", className: "mb-4" },
                  },
                ],
              },
            ],
          },
        );
      } else if (isAdvanced) {
        components.push(
          {
            type: "Text",
            props: { className: "text-2xl font-bold mb-6" },
            children: "Advanced Form",
          },
          { type: "Label", props: {}, children: "Name" },
          { type: "Input", props: { className: "mb-4" } },
          { type: "Label", props: {}, children: "Email" },
          {
            type: "InputGroup",
            props: { className: "mb-4" },
            children: [{ type: "Input", props: { type: "email" } }],
          },
          { type: "Label", props: {}, children: "Category" },
          {
            type: "Select",
            props: {
              className: "mb-4",
              options: ["General", "Support", "Sales"],
            },
          },
          { type: "Label", props: {}, children: "Priority" },
          {
            type: "RadioGroup",
            props: { options: ["Low", "Medium", "High"], className: "mb-4" },
          },
          { type: "Label", props: {}, children: "Message" },
          { type: "Textarea", props: { rows: 4, className: "mb-4" } },
          {
            type: "Checkbox",
            props: { label: "Send me updates", className: "mb-4" },
          },
          {
            type: "Button",
            props: { className: "w-full" },
            children: "Submit",
          },
        );
      } else {
        components.push(
          {
            type: "Text",
            props: { className: "text-2xl font-bold mb-4" },
            children: "Contact Form",
          },
          { type: "Label", props: {}, children: "Name" },
          {
            type: "Input",
            props: { placeholder: "Your name", className: "mb-4" },
          },
          { type: "Label", props: {}, children: "Email" },
          {
            type: "Input",
            props: {
              type: "email",
              placeholder: "you@example.com",
              className: "mb-4",
            },
          },
          { type: "Label", props: {}, children: "Message" },
          {
            type: "Textarea",
            props: {
              rows: 4,
              placeholder: "Your message...",
              className: "mb-4",
            },
          },
          {
            type: "Button",
            props: { className: "w-full" },
            children: "Submit",
          },
        );
      }
    }

    // ==========================================
    // TABLES & DATA LISTS
    // ==========================================
    else if (
      lower.includes("table") ||
      lower.includes("list") ||
      lower.includes("users")
    ) {
      usedDeterministic = true;
      steps.push("Creating data table");

      const hasPagination =
        lower.includes("pagination") || lower.includes("pages");
      const hasSearch = !lower.includes("simple");
      const hasFilters = lower.includes("filter") || lower.includes("advanced");

      components.push({
        type: "Stack",
        props: {
          direction: "row",
          className: "justify-between items-center mb-4",
        },
        children: [
          {
            type: "Text",
            props: { className: "text-2xl font-bold" },
            children: "User Management",
          },
          { type: "Button", props: {}, children: "+ Add User" },
        ],
      });

      if (hasSearch) {
        components.push({
          type: "Input",
          props: { placeholder: "Search users...", className: "mb-4" },
        });
      }

      if (hasFilters) {
        components.push({
          type: "Stack",
          props: { direction: "row", gap: "2", className: "mb-4" },
          children: [
            {
              type: "Select",
              props: {
                placeholder: "Role",
                options: ["All", "Admin", "User", "Manager"],
              },
            },
            {
              type: "Select",
              props: {
                placeholder: "Status",
                options: ["All", "Active", "Inactive"],
              },
            },
            {
              type: "Button",
              props: { variant: "outline" },
              children: "Clear Filters",
            },
          ],
        });
      }

      components.push({
        type: "Table",
        props: {
          headers: ["Name", "Email", "Role", "Status", "Actions"],
          rows: [
            ["John Doe", "john@example.com", "Admin", "Active", "⋮"],
            ["Jane Smith", "jane@example.com", "User", "Active", "⋮"],
            ["Bob Wilson", "bob@example.com", "Manager", "Inactive", "⋮"],
          ],
        },
      });

      if (hasPagination) {
        components.push({
          type: "Pagination",
          props: { totalPages: 10, currentPage: 1, className: "mt-4" },
        });
      }
    }

    // ==========================================
    // PRICING TABLES
    // ==========================================
    else if (lower.includes("pricing") || lower.includes("plans")) {
      usedDeterministic = true;
      steps.push("Building pricing page");

      const tierCount = lower.includes("4") || lower.includes("four") ? 4 : 3;

      components.push(
        {
          type: "Text",
          props: { className: "text-4xl font-bold text-center mb-3" },
          children: "Choose Your Plan",
        },
        {
          type: "Text",
          props: { className: "text-gray-500 text-center mb-8" },
          children: "Select the perfect plan for your needs",
        },
        {
          type: "Grid",
          props: { cols: String(tierCount), gap: "6" },
          children: [
            {
              type: "Card",
              props: {
                className: "p-8 text-center hover:shadow-xl transition-shadow",
              },
              children: [
                {
                  type: "Badge",
                  props: { variant: "outline", className: "mb-3" },
                  children: "Starter",
                },
                {
                  type: "Text",
                  props: { className: "text-5xl font-bold my-4" },
                  children: "$9",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-6" },
                  children: "per month",
                },
                { type: "Separator", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ 10 Projects",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ Basic Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-6" },
                  children: "✓ 5GB Storage",
                },
                {
                  type: "Button",
                  props: { variant: "outline", className: "w-full" },
                  children: "Get Started",
                },
              ],
            },
            {
              type: "Card",
              props: {
                className:
                  "p-8 text-center border-2 border-primary shadow-xl scale-105",
              },
              children: [
                {
                  type: "Badge",
                  props: { className: "mb-3" },
                  children: "Most Popular",
                },
                {
                  type: "Text",
                  props: { className: "text-5xl font-bold my-4" },
                  children: "$29",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-6" },
                  children: "per month",
                },
                { type: "Separator", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ Unlimited Projects",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ Priority Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ 50GB Storage",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-6" },
                  children: "✓ Advanced Analytics",
                },
                {
                  type: "Button",
                  props: { className: "w-full" },
                  children: "Get Started",
                },
              ],
            },
            {
              type: "Card",
              props: {
                className: "p-8 text-center hover:shadow-xl transition-shadow",
              },
              children: [
                {
                  type: "Badge",
                  props: { variant: "outline", className: "mb-3" },
                  children: "Enterprise",
                },
                {
                  type: "Text",
                  props: { className: "text-5xl font-bold my-4" },
                  children: "$99",
                },
                {
                  type: "Text",
                  props: { className: "text-gray-500 mb-6" },
                  children: "per month",
                },
                { type: "Separator", props: { className: "mb-4" } },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ Everything in Pro",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-2" },
                  children: "✓ 24/7 Support",
                },
                {
                  type: "Text",
                  props: { className: "text-sm mb-6" },
                  children: "✓ Unlimited Storage",
                },
                {
                  type: "Button",
                  props: { variant: "outline", className: "w-full" },
                  children: "Contact Sales",
                },
              ],
            },
          ],
        },
      );
    }

    // ==========================================
    // SETTINGS PAGE
    // ==========================================
    else if (lower.includes("settings") || lower.includes("preferences")) {
      usedDeterministic = true;
      steps.push("Creating settings interface");

      components.push(
        {
          type: "Text",
          props: { className: "text-3xl font-bold mb-6" },
          children: "Settings",
        },
        {
          type: "Tabs",
          props: { defaultValue: "general" },
          children: [
            {
              type: "TabsList",
              props: { className: "mb-6" },
              children: [
                {
                  type: "TabsTrigger",
                  props: { value: "general" },
                  children: "General",
                },
                {
                  type: "TabsTrigger",
                  props: { value: "notifications" },
                  children: "Notifications",
                },
                {
                  type: "TabsTrigger",
                  props: { value: "security" },
                  children: "Security",
                },
              ],
            },
            {
              type: "TabsContent",
              props: { value: "general" },
              children: [
                {
                  type: "Card",
                  props: { className: "p-6 mb-4" },
                  children: [
                    {
                      type: "Text",
                      props: { className: "font-semibold mb-4" },
                      children: "Profile Settings",
                    },
                    { type: "Label", props: {}, children: "Display Name" },
                    {
                      type: "Input",
                      props: { defaultValue: "John Doe", className: "mb-4" },
                    },
                    { type: "Label", props: {}, children: "Bio" },
                    { type: "Textarea", props: { rows: 3, className: "mb-4" } },
                  ],
                },
                {
                  type: "Card",
                  props: { className: "p-6" },
                  children: [
                    {
                      type: "Text",
                      props: { className: "font-semibold mb-4" },
                      children: "Preferences",
                    },
                    { type: "Label", props: {}, children: "Language" },
                    {
                      type: "Select",
                      props: {
                        options: ["English", "Spanish", "French"],
                        className: "mb-4",
                      },
                    },
                    { type: "Label", props: {}, children: "Theme" },
                    {
                      type: "RadioGroup",
                      props: {
                        options: ["Light", "Dark", "System"],
                        className: "mb-4",
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "TabsContent",
              props: { value: "notifications" },
              children: [
                {
                  type: "Card",
                  props: { className: "p-6" },
                  children: [
                    {
                      type: "Text",
                      props: { className: "font-semibold mb-4" },
                      children: "Notification Preferences",
                    },
                    {
                      type: "Switch",
                      props: {
                        label: "Email notifications",
                        className: "mb-3",
                      },
                    },
                    {
                      type: "Switch",
                      props: { label: "Push notifications", className: "mb-3" },
                    },
                    {
                      type: "Switch",
                      props: { label: "SMS alerts", className: "mb-3" },
                    },
                    { type: "Switch", props: { label: "Marketing emails" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "Button",
          props: { className: "mt-6" },
          children: "Save Changes",
        },
      );
    }

    // ==========================================
    // AI FALLBACK - Complex/Unknown Requests
    // ==========================================
    if (!usedDeterministic) {
      steps.push("No deterministic match found - invoking Groq AI");
      try {
        const aiComponents = await callGroq(prompt);
        if (aiComponents && aiComponents.length > 0) {
          components.push(...aiComponents);
          steps.push(
            `✨ Groq AI generated ${aiComponents.length} custom components`,
          );
        } else {
          throw new Error("No components returned");
        }
      } catch (error) {
        console.error("Groq AI failed:", error);
        steps.push("⚠️ AI generation failed - showing suggestions");
        components.push(
          {
            type: "Alert",
            props: { variant: "warning", className: "mb-4" },
            children: "We couldn't generate a custom layout for this request.",
          },
          {
            type: "Text",
            props: { className: "text-2xl font-bold mb-4" },
            children: "Try these suggestions:",
          },
          {
            type: "Stack",
            props: { direction: "column", gap: "2" },
            children: [
              {
                type: "Button",
                props: { variant: "outline", className: "justify-start" },
                children: "→ Login page with sidebar",
              },
              {
                type: "Button",
                props: { variant: "outline", className: "justify-start" },
                children: "→ Dashboard with analytics charts",
              },
              {
                type: "Button",
                props: { variant: "outline", className: "justify-start" },
                children: "→ Settings page with tabs",
              },
              {
                type: "Button",
                props: { variant: "outline", className: "justify-start" },
                children: "→ Pricing plans",
              },
              {
                type: "Button",
                props: { variant: "outline", className: "justify-start" },
                children: "→ Contact form with validation",
              },
            ],
          },
        );
      }
    }

    // ==========================================
    // FINAL ASSEMBLY
    // ==========================================
    const finalPlan: AgentPlan = {
      id: `gen-${Date.now()}`,
      intent: prompt,
      layout: detectedLayout,
      steps,
      explanation: usedDeterministic
        ? `Used optimized template: ${steps
            .filter(
              (s) =>
                s.includes("Using") ||
                s.includes("Building") ||
                s.includes("Creating") ||
                s.includes("Constructing"),
            )
            .join(", ")}`
        : `AI-generated custom layout: ${steps.join(" → ")}`,
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
