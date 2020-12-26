const { google } = require('googleapis');
const credentials = require('./credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const spreadsheetId = process.env.G_SPREADSHEET_ID;
const range = process.env.G_RANGE;

module.exports = {
  getStock,
};

/**
 * Get Spreadsheets data
 * @returns Promise<[[], []]>
 */
async function getSpreadSheets() {
  const client = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPES
  );
  client.authorize((err, tokens) => {
    if (err) throw err;
  });

  const gsApi = google.sheets({ version: 'v4', auth: client });

  return await gsApi.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
}

async function getStock(stockName) {
  const response = await getSpreadSheets();

  const values = response.data.values;
  const result =
    values && values.length > 0
      ? values.map((row) => {
          return { id: row[0], name: row[1], stock: row[2] };
        })
      : [];
  
  if (result.length === 0) return 'Database is null'

  const found = result.find(
    (row) => row.name.toLowerCase() === stockName.toLowerCase()
  );

  return found ? found : null;
}
