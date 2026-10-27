# Plain fetch and Zod over a typed GraphQL client

Workout data is loaded with `fetch` against the Contentful GraphQL endpoint using one query string, wrapped in TanStack Query 5 for caching, retries and error states. Zod 4 parses and normalises the response. `warmUp`, `powerSet` and `coolDown` are Contentful JSON scalars, so GraphQL types describe them only as `JSON`, and runtime validation is needed regardless of tooling.

## Considered Options

- **gql.tada**: infers types from the schema, but the fields that matter come back as untyped JSON, so it adds a TypeScript plugin and schema setup without typing the risky part.
- **graphql-codegen**: same limitation, plus a generation step.
- **Apollo or urql**: a normalised cache and client we don't need for one read-only query.

## Consequences

- The exercise data is inconsistent (rests as strings or numbers, `duration` as a number or an `[h, m, s]` array, rest lists shorter than rep lists), so the Zod schemas are where that is handled.
- The Contentful token comes from the brief and is a read-only delivery token, so it is committed rather than hidden behind an environment variable.
