import { Client } from "@elastic/elasticsearch";
const elasticClient = new Client({
  node: "http://localhost:9200",
  maxRetries: 5,
  requestTimeout: 60000,
});

export const elaClient = elasticClient;
