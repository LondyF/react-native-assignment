import type { ZodType } from 'zod';

const CONTENTFUL_ENDPOINT = process.env.EXPO_PUBLIC_CONTENTFUL_ENDPOINT ?? '';
const CONTENTFUL_DELIVERY_TOKEN = process.env.EXPO_PUBLIC_CONTENTFUL_DELIVERY_TOKEN;

type ContentfulRequest<TResponse> = {
  query: string;
  variables?: Record<string, unknown>;
  schema: ZodType<TResponse>;
};

export const contentfulRequest = async <TResponse>({
  query,
  variables,
  schema,
}: ContentfulRequest<TResponse>): Promise<TResponse> => {
  const response = await fetch(CONTENTFUL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONTENTFUL_DELIVERY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Contentful responded with ${response.status}`);
  }

  return schema.parse(await response.json());
};
