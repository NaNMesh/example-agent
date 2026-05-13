// Supabase query tool exposed to the agent.
import { createClient } from '@supabase/supabase-js';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

export const supabaseQueryTool = tool(
  async ({ table, limit }: { table: string; limit?: number }) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(limit ?? 10);
    if (error) return JSON.stringify({ error: error.message });
    return JSON.stringify({ rows: data });
  },
  {
    name: 'supabase_query',
    description: 'Query a Supabase table and return up to N rows.',
    schema: z.object({
      table: z.string(),
      limit: z.number().int().min(1).max(50).optional(),
    }),
  },
);
