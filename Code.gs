// Application constants
const APP_TITLE = 'XML Report';
const SHEET_DATA = 'Dados_NFE';
const SHEET_TEMPLATE_DETALHADO = 'Template_Detalhado'
const SHEET_TEMPLATE_TOTAL = 'Template_Total'

function main() {
  SpreadsheetApp.getUi().showSidebar(
    HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setTitle("File selector sample")
  );
}

function getFiles(e, rootFolderId) {
  var data = {};
  var idn = e;
  e = e == "root" ? DriveApp.getRootFolder().getId() : e;
  data[e] = {};
  data[e].keyname = DriveApp.getFolderById(e).getName();
  data[e].keyparent = idn == rootFolderId
    ? null : DriveApp.getFolderById(e).getParents().hasNext()
    ? DriveApp.getFolderById(e).getParents().next().getId() : null;
  data[e].files = [];
  var da = idn == "root" ? DriveApp.getRootFolder() : DriveApp.getFolderById(e);
  var folders = da.getFolders();
  var files = da.getFiles();
  while (folders.hasNext()) {
    var folder = folders.next();
    data[e].files.push({name: folder.getName(), id: folder.getId(), mimeType: "folder"});
  }
  while (files.hasNext()) {
    var file = files.next();
    data[e].files.push({name: file.getName(), id: file.getId(), mimeType: file.getMimeType()});
  }
  return data;
}

function listXmlFiles(id) {
  Logger.log('listFiles')
  var data = {};
  data.files = [];
  data.names = [];
  var da = DriveApp.getFolderById(id);
  var files = da.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    if(file.getMimeType() === 'text/xml'){
      data.files.push({name: file.getName(), id: file.getId(), mimeType: file.getMimeType()});
      //data.names.push(file.getBlob().getDataAsString())
      data.names.push(file.getId())
    }
  }
  return data.names;
}


// Fill the SHEET_DATA with all files data.
function parseXmlFiles(files){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetData = spreadsheet.getSheetByName(SHEET_DATA);
  
  // DETAIL
  let ROW = 2 
  for(let i = 0; i<= files.length; i++){
    //var fileId = '1UVuudOgsYsGJeZ1LWVIUpZ2QRnd2zEUD'
    const fileId = files[i]
    var data = DriveApp.getFileById(fileId).getBlob().getDataAsString(); 
    var xmlDocument=XmlService.parse(data);                              
    var root=xmlDocument.getRootElement();
    var mynamespace=root.getNamespace();
    const infNFe = root.getChild("infNFe",mynamespace);

    const chave_nfe = infNFe.getAttribute('Id').getValue()

    const emit = infNFe.getChild("emit", mynamespace);
    const cnpj = emit.getChild('CNPJ', mynamespace).getText()
    const razao_social = emit.getChild('xNome', mynamespace).getText()

    const dest = infNFe.getChild("dest", mynamespace);
    const dest_nome = dest.getChild('xNome', mynamespace).getText()

    const ide = infNFe.getChild("ide", mynamespace);
    const dt_emissao = ide.getChild('dEmi', mynamespace).getText()
 
    const total = infNFe.getChild("total", mynamespace)
    const icmsTot = total.getChild("ICMSTot", mynamespace)
    const vNF = icmsTot.getChild('vNF', mynamespace).getText()
   
    // DET
    const det = infNFe.getChildren('det', mynamespace)
    for(let j=0; j<= det.length;j++){
      const prod = det[j].getChild('prod', mynamespace)
      const xProd = prod.getChild('xProd', mynamespace).getText()
      const cfop = prod.getChild('CFOP', mynamespace).getText()

      sheetData.getRange(`A${ROW}`).setValue(razao_social)
      sheetData.getRange(`B${ROW}`).setValue(cnpj)
      sheetData.getRange(`C${ROW}`).setValue(dest_nome)
      sheetData.getRange(`D${ROW}`).setValue(chave_nfe)
      sheetData.getRange(`E${ROW}`).setValue(dt_emissao)
      sheetData.getRange(`F${ROW}`).setValue(vNF)
      sheetData.getRange(`G${ROW}`).setValue(xProd)
      sheetData.getRange(`H${ROW}`).setValue(cfop)

      ROW++
    }
  }


  return root
}

function doSomething(id) {
  // do something
  var files = listXmlFiles(id)
  var doc = parseXmlFiles(files)
  return `${files.length} arquivos XML nessa pasta`;
}
