function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  const keyword = (e.parameter.q || "").toLowerCase();

  const result = data
    .filter((row, i) => i > 0)
    .map(row => ({
      name: row[0],
      relationship: row[1],
      table: row[2]
    }));

  // If searching with a keyword, filter results
  if (keyword && keyword !== 'init') {
    return ContentService.createTextOutput(JSON.stringify(
      result.filter(row =>
        row.name.toLowerCase().includes(keyword) ||
        row.relationship.toLowerCase().includes(keyword)
      )
    )).setMimeType(ContentService.MimeType.JSON);
  }

  // If q=init, return all guests
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
