export type UIComponent = {
  type: string;
  props: Record<string, any>;
  children?: UIComponent[] | string;
};

export interface AgentPlan {
  id: string;
  intent: string;
  layout: "centered" | "dashboard" | "split";
  steps: string[];
  components: UIComponent[];
  explanation: string;
  timestamp: number;
}
