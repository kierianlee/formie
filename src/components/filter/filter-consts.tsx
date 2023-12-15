export const InputType = {
  TEXT: "text",
  SELECT: "selecf",
} as const;
export type InputType = (typeof InputType)[keyof typeof InputType];

export const QueryType = {
  CONTAINS: "contains",
  EQUALS: "equals",
} as const;
export type QueryType = (typeof QueryType)[keyof typeof QueryType];
