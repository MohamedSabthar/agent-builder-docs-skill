// Fake stdio MCP server for MCP screenshots: lists a fixed set of tools, needs no network.
//   node demo-mcp-server.mjs tickets   (or orders)
// Register it in .mcp.json with "command": "node" and the absolute path of this file, so the
// manager shows a connected server with tools, without your personal servers or npx downloads.
const SETS = {
  tickets: [['search_tickets', 'Search support tickets by keyword'], ['get_ticket', 'Get a support ticket by its ID'],
    ['update_ticket_status', 'Change the status of a support ticket']],
  orders: [['get_order', 'Get an order by its ID'], ['list_recent_orders', 'List a customer\'s recent orders']],
};
const tools = (SETS[process.argv[2]] || SETS.tickets).map(([name, description]) => ({
  name, description, inputSchema: { type: 'object', properties: { query: { type: 'string' } } },
}));
const send = msg => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
let buf = '';
process.stdin.on('data', chunk => {
  buf += chunk;
  for (let i; (i = buf.indexOf('\n')) >= 0;) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    const req = JSON.parse(line);
    if (req.id === undefined) continue; // notifications need no reply
    if (req.method === 'initialize') send({ id: req.id, result: { protocolVersion: req.params?.protocolVersion || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: process.argv[2] || 'tickets', version: '1.0.0' } } });
    else if (req.method === 'tools/list') send({ id: req.id, result: { tools } });
    else if (req.method === 'tools/call') send({ id: req.id, result: { content: [{ type: 'text', text: 'Sample result' }] } });
    else send({ id: req.id, result: {} });
  }
});
