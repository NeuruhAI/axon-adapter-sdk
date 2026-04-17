import { PermissionLevel } from './permission';

export interface ToolDefinition<I, O> {
  name: string;
  description: string;
  permission: PermissionLevel;
  schema: { parse(input: unknown): I };
  execute(input: I): Promise<O>;
}

export function defineTool<I, O>(def: ToolDefinition<I, O>): ToolDefinition<I, O> {
  if (!def.name || !def.description) {
    throw new Error('Tool must have a name and description');
  }
  return def;
}
