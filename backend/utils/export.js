const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const sendCsv = (res, filename, headers, rows) => {
  const escape = (v) => {
    const s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(',')];
  rows.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(',')));
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('\uFEFF' + lines.join('\n'));
};

const sendExcel = async (res, filename, sheetName, columns, rows) => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'DawoStock';
  const ws = wb.addWorksheet(sheetName);
  ws.columns = columns;
  ws.addRows(rows);
  ws.getRow(1).font = { bold: true };
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  await wb.xlsx.write(res);
  res.end();
};

const sendPdfTable = (res, filename, title, headers, rows) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.fontSize(16).fillColor('#0f766e').text('DawoStock', { align: 'left' });
  doc.fontSize(12).fillColor('#111827').text(title);
  doc.fontSize(9).fillColor('#6b7280').text(`Generated ${new Date().toISOString()}`);
  doc.moveDown();

  const colWidth = (doc.page.width - 80) / headers.length;
  let y = doc.y;
  doc.fontSize(8).fillColor('#0f766e');
  headers.forEach((h, i) => {
    doc.text(h, 40 + i * colWidth, y, { width: colWidth - 4 });
  });
  y += 18;
  doc.fillColor('#111827');

  rows.forEach((row) => {
    if (y > doc.page.height - 60) {
      doc.addPage();
      y = 40;
    }
    headers.forEach((h, i) => {
      doc.text(String(row[h] ?? ''), 40 + i * colWidth, y, { width: colWidth - 4 });
    });
    y += 16;
  });

  doc.end();
};

module.exports = { sendCsv, sendExcel, sendPdfTable };
