import { Express } from "express";
import Groq from "groq-sdk";

export async function registerRoutes(app: Express) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;

    const componentList = [
      "Accordion",
      "Alert",
      "Avatar",
      "Badge",
      "Breadcrumb",
      "Button",
      "Card",
      "Carousel",
      "Chart",
      "Checkbox",
      "Collapsible",
      "Command",
      "Dialog",
      "Drawer",
      "DropdownMenu",
      "Empty",
      "Input",
      "InputOTP",
      "Label",
      "Menubar",
      "NavigationMenu",
      "Pagination",
      "Popover",
      "Progress",
      "RadioGroup",
      "Resizable",
      "ScrollArea",
      "Select",
      "Separator",
      "Sheet",
      "Sidebar",
      "Skeleton",
      "Slider",
      "Switch",
      "Table",
      "Tabs",
      "Textarea",
      "Toast",
      "Toggle",
      "Tooltip",
    ];

    const systemPrompt = `
      You are an expert React UI Architect. 
      Your task is to generate a JSON representation of a UI based on a user's request.
      
      AVAILABLE COMPONENTS:
      ${componentList.join(", ")}

      GUIDELINES:
      1. Use 'Stack' for layouts (props: direction="row"|"column", gap="number").
      2. Use 'Box' for generic containers.
      3. All components must follow this structure: { "type": "ComponentName", "props": { ... }, "children": [...] }
      4. For components like Text or Button, 'children' can be a string.
      5. Use Tailwind CSS classes in the 'className' prop for styling.

      RESPONSE FORMAT:
      Return ONLY a JSON object:
      {
        "id": "unique-id",
        "intent": "description of user goal",
        "layout": "centered" | "dashboard" | "split",
        "steps": ["Reasoning step 1", "Reasoning step 2"],
        "components": [...],
        "explanation": "Briefly explain the design choices"
      }
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      const plan = JSON.parse(completion.choices[0].message.content!);
      res.json({ ...plan, timestamp: Date.now() });
    } catch (error) {
      console.error("Groq Error:", error);
      res.status(500).json({ message: "Failed to generate UI" });
    }
  });
}
