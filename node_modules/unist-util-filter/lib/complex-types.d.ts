import type {Node} from 'unist'

type MatchesOne<Value, Check> =
  // Is this a node?
  Value extends Node
    ? // No test.
      Check extends null | undefined
      ? Value
      : // Function test.
      Check extends Function
      ? Check extends (value: any) => value is infer Inferred
        ? Value extends Inferred
          ? Value
          : undefined
        : // This test function isn’t a type predicate.
          Value | undefined
      : // String (type) test.
      Value['type'] extends Check
      ? Value extends {type: Check}
        ? Value
        : Value | undefined
      : // Partial test.
      Value extends Check
      ? Value
      : undefined
    : undefined

export type Matches<Value, Check> =
  // Is this a list?
  Check extends any[]
    ? MatchesOne<Value, Check[keyof Check]>
    : MatchesOne<Value, Check>
