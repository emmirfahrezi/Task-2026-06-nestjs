import { z } from 'zod';

const schema = z.string();

console.log("required:", schema.safeParse(undefined).error?.issues[0]?.message);
console.log("type:", schema.safeParse(123).error?.issues[0]?.message);
