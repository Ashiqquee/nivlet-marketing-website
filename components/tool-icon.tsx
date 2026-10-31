import { Braces, FolderClosed, Images, ListTodo, MessageSquareText } from 'lucide-react';

export type ToolName = 'prompts' | 'fill-in-prompt' | 'references' | 'pockets' | 'scratchpad';
const icons = { prompts: MessageSquareText, 'fill-in-prompt': Braces, references: Images, pockets: FolderClosed, scratchpad: ListTodo };

export function ToolIcon({ tool, size = 24 }: { tool: ToolName; size?: number }) {
  const Icon = icons[tool];
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}

export function AppIcon({ tool, large = false }: { tool: ToolName; large?: boolean }) {
  return <span className={`app-icon app-icon-${tool} ${large ? 'app-icon-large' : ''}`}><ToolIcon tool={tool} size={large ? 36 : 24} /></span>;
}
