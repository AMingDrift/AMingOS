import { z } from 'zod';

export const errorSchema = z
    .object({
        code: z.number().optional().meta({ type: 'number' }),
        message: z.string().meta({ type: 'string' }),
        errors: z.any().optional().meta({ type: 'object' }),
    })
    .strict();
