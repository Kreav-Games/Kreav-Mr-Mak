// Stdio MCP bridge for the Claude coordinator. Claude Code starts this process
// and sees only Mr. Mak's coordinator tools; each call is forwarded to the
// service's private loopback endpoint, which checks a per-process token.
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { coordinatorTools } from './coordinator.mjs';
import { extraTools } from './claude-coordinator.mjs';

const url = process.env.MRMAK_TOOL_URL, token = process.env.MRMAK_TOOL_TOKEN;
if (!url || !token) { process.stderr.write('Missing Mr. Mak tool endpoint.\n'); process.exit(1); }
const tools = [...coordinatorTools, ...extraTools];

const server = new Server({ name: 'mak', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
}));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args = {} } = request.params;
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, args }), signal: AbortSignal.timeout(170000),
    });
    const value = await response.json().catch(() => ({ error: 'Invalid tool response.' }));
    if (!response.ok || value.error) return { isError: true, content: [{ type: 'text', text: value.error || `Tool failed (${response.status}).` }] };
    return { content: [{ type: 'text', text: JSON.stringify(value.result ?? null) }] };
  } catch (error) {
    return { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] };
  }
});
await server.connect(new StdioServerTransport());
