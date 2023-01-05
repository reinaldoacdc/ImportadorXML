function processReportHeader(data, sheet){
  const cnpj = data[0].emitente_cnpj
  const razao_social = data[0].emitente_nome

  sheet.getRange('E1:H1').setValue(razao_social)
  sheet.getRange('E2:H2').setValue(cnpj)
}

function processReportTotal() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheetData = spreadsheet.getSheetByName(SHEET_DATA);
  const sheet = spreadsheet.getSheetByName(SHEET_TEMPLATE_TOTAL)

  // Gets data from the storage sheets as objects.
  const data = dataRangeToObject(sheetData);
  let nfe = []

  processReportHeader(data, sheet)
  data.forEach(item => {
    if (!nfe[item.chave]) { nfe[item.chave] = [] }
    nfe[item.chave].push(item)
    Logger.log(`nfe loop: ${nfe[item.chave]}`)    
  })

  Logger.log(`nf: `, nfe)

  nfe.forEach(item => {
      Logger.log(`item: ${item}`)
      sheet.getRange(`A${ROW}:B${ROW}`).setValue(item.chave)
      sheet.getRange(`C${ROW}:D${ROW}`).setValue(item.destinatario)
      sheet.getRange(`E${ROW}`).setValue(item.data_emissao)
      //sheet.getRange(`F${ROW}`).setValue(item.cfop)
      sheet.getRange(`G${ROW}:I${ROW}`).setValue(item.total)      
  })


  
}

function processReportDetalhado() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheetData = spreadsheet.getSheetByName(SHEET_DATA);
  const sheet = spreadsheet.getSheetByName(SHEET_TEMPLATE_DETALHADO)

  // Gets data from the storage sheets as objects.
  const data = dataRangeToObject(sheetData);

  processReportHeader(data, sheet)
  let ROW = 7
  for (item of data){
      sheet.getRange(`A${ROW}:B${ROW}`).setValue(item.produto)
      sheet.getRange(`C${ROW}:D${ROW}`).setValue(item.destinatario)
      sheet.getRange(`E${ROW}`).setValue(item.data_emissao)
      sheet.getRange(`F${ROW}`).setValue(item.cfop)
      sheet.getRange(`G${ROW}`).setValue(item.total)

      ROW++
  }
  
}
