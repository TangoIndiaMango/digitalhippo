import { type } from "os";
import { z } from "zod";

export const QueryValidators = z.object({
    category: z.string().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    limit: z.number().optional(),
})

export type TQueryValidators = z.infer<typeof QueryValidators>