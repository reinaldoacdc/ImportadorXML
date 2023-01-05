function onOpen(e) {

const menu = SpreadsheetApp.getUi().createMenu(APP_TITLE)
  menu
    .addItem('Selecionar pasta', 'main')
    .addSeparator()
    .addItem('Relatório Total de NFE', 'processReportTotal')
    .addItem('Relatório Detalhado de NFE', 'processReportDetalhado')
    .addToUi();
}