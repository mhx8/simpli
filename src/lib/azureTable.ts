import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const tableName = process.env.AZURE_TABLE_NAME || "SimpliLeads";

function getTableClient() {
  if (!accountName || !accountKey) {
    throw new Error("Azure Storage Account Name or Key is missing");
  }

  const credential = new AzureNamedKeyCredential(accountName, accountKey);

  return new TableClient(
    `https://${accountName}.table.core.windows.net`,
    tableName,
    credential
  );
}

export async function saveLead(lead: any) {
  const client = getTableClient();

  const entity = {
    partitionKey: "Leads",
    rowKey: new Date().getTime().toString(),
    ...lead,
  };

  await client.createEntity(entity);
}