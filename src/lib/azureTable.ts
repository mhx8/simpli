import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const tableName = process.env.AZURE_TABLE_NAME || "SimpliLeads";

if (!accountName || !accountKey) {
  throw new Error("Azure Storage Account Name or Key is missing");
}

const credential = new AzureNamedKeyCredential(accountName, accountKey);

export const tableClient = new TableClient(
  `https://${accountName}.table.core.windows.net`,
  tableName,
  credential
);

export async function saveLead(lead: any) {
  try {
    // Ensure the table exists
    await tableClient.createTable();
  } catch (e) {
    // Table might already exist, ignore
  }

  const entity = {
    partitionKey: "Leads",
    rowKey: new Date().getTime().toString(),
    ...lead,
  };

  await tableClient.createEntity(entity);
}