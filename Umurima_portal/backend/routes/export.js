const express = require('express');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Farm = require('../models/Farm');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const styleExcelHeader = (sheet) => {
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF16A34A' },
  };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 25;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('rw-RW') : '-';

/* ============ EXCEL - MY FARMS ============ */
router.get('/my-farms/excel', protect, async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id });
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Abahinzi Portal';
    const sheet = workbook.addWorksheet('Imirima Yanjye');

    sheet.columns = [
      { header: 'Izina ry\'Umurima', key: 'farmName', width: 25 },
      { header: 'Igihingwa', key: 'cropType', width: 18 },
      { header: 'Ingano (ha)', key: 'size', width: 12 },
      { header: 'Aho Uherereye', key: 'location', width: 25 },
      { header: 'Ubutaka', key: 'soilType', width: 15 },
      { header: 'Italiki yo Gutera', key: 'plantingDate', width: 18 },
      { header: 'Italiki yo Gusarura', key: 'expectedHarvest', width: 18 },
      { header: 'Umubare w\'Ibiti', key: 'treeCount', width: 15 },
      { header: 'Ubwoko bw\'Ibiti', key: 'treeTypes', width: 35 },
      { header: 'Andi Makuru', key: 'notes', width: 25 },
    ];

    styleExcelHeader(sheet);

    farms.forEach((f) => {
      sheet.addRow({
        farmName: f.farmName,
        cropType: f.cropType,
        size: f.size,
        location: f.location,
        soilType: f.soilType,
        plantingDate: formatDate(f.plantingDate),
        expectedHarvest: formatDate(f.expectedHarvest),
        treeCount: f.treeCount || 0,
        treeTypes: (f.treeTypes || []).join(', '),
        notes: f.notes || '-',
      });
    });

    sheet.addRow({});
    const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
    const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);
    const summaryRow = sheet.addRow({
      farmName: 'MURI RUSANGE',
      size: totalSize,
      treeCount: totalTrees,
    });
    summaryRow.font = { bold: true, color: { argb: 'FF16A34A' } };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=imirima_yanjye_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ============ EXCEL - ALL FARMS ============ */
router.get('/all-farms/excel', protect, adminOnly, async (req, res) => {
  try {
    const farms = await Farm.find().populate(
      'userId',
      'username identityNumber telephone location'
    );
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Abahinzi Portal';
    const sheet = workbook.addWorksheet('Imirima Yose');

    sheet.columns = [
      { header: 'Nyir\'Umurima', key: 'owner', width: 20 },
      { header: 'Indangamuntu', key: 'identity', width: 22 },
      { header: 'Telefone', key: 'tel', width: 15 },
      { header: 'Aho Atuye', key: 'userLocation', width: 22 },
      { header: 'Izina ry\'Umurima', key: 'farmName', width: 25 },
      { header: 'Igihingwa', key: 'cropType', width: 18 },
      { header: 'Ingano (ha)', key: 'size', width: 12 },
      { header: 'Aho Umurima Uherereye', key: 'location', width: 25 },
      { header: 'Umubare w\'Ibiti', key: 'treeCount', width: 15 },
      { header: 'Ubwoko bw\'Ibiti', key: 'treeTypes', width: 35 },
    ];

    styleExcelHeader(sheet);

    farms.forEach((f) => {
      sheet.addRow({
        owner: f.userId?.username || '-',
        identity: f.userId?.identityNumber || '-',
        tel: f.userId?.telephone || '-',
        userLocation: f.userId?.location || '-',
        farmName: f.farmName,
        cropType: f.cropType,
        size: f.size,
        location: f.location,
        treeCount: f.treeCount || 0,
        treeTypes: (f.treeTypes || []).join(', '),
      });
    });

    sheet.addRow({});
    const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
    const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);
    const summaryRow = sheet.addRow({
      owner: 'MURI RUSANGE',
      size: totalSize,
      treeCount: totalTrees,
    });
    summaryRow.font = { bold: true, color: { argb: 'FF16A34A' } };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=imirima_yose_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ============ PDF - MY FARMS ============ */
router.get('/my-farms/pdf', protect, async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id });

    const doc = new PDFDocument({
      margin: 30,
      size: 'A4',
      layout: 'landscape',
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=imirima_yanjye_${Date.now()}.pdf`
    );
    doc.pipe(res);

    doc
      .fillColor('#16a34a')
      .fontSize(24)
      .text('ABAHINZI PORTAL', { align: 'center' });
    doc
      .fillColor('#000')
      .fontSize(14)
      .text('Raporo y\'Imirima Yanjye', { align: 'center' });
    doc
      .fontSize(10)
      .fillColor('#666')
      .text(`Nyir'umurima: ${req.user.username}`, { align: 'center' })
      .text(`Indangamuntu: ${req.user.identityNumber}`, { align: 'center' })
      .text(`Italiki: ${new Date().toLocaleDateString('rw-RW')}`, {
        align: 'center',
      });

    doc.moveDown(1.5);

    const tableTop = doc.y;
    const colWidths = [130, 85, 55, 110, 80, 60, 150];
    const headers = [
      'Izina ry\'Umurima',
      'Igihingwa',
      'Ingano',
      'Aho Uherereye',
      'Ubutaka',
      'Ibiti',
      'Ubwoko bw\'Ibiti',
    ];

    let x = 30;
    headers.forEach((h, i) => {
      doc.rect(x, tableTop, colWidths[i], 24).fill('#16a34a');
      doc
        .fillColor('#fff')
        .fontSize(10)
        .text(h, x + 4, tableTop + 7, { width: colWidths[i] - 8 });
      x += colWidths[i];
    });

    let y = tableTop + 24;
    farms.forEach((f, idx) => {
      x = 30;
      if (y > 520) {
        doc.addPage();
        y = 40;
      }
      if (idx % 2 === 0) {
        doc
          .rect(30, y, colWidths.reduce((a, b) => a + b), 22)
          .fill('#f0fdf4');
      }
      const row = [
        f.farmName,
        f.cropType,
        String(f.size),
        f.location,
        f.soilType,
        String(f.treeCount || 0),
        (f.treeTypes || []).join(', ') || '-',
      ];
      row.forEach((cell, i) => {
        doc
          .fillColor('#000')
          .fontSize(9)
          .text(cell, x + 4, y + 6, {
            width: colWidths[i] - 8,
            ellipsis: true,
          });
        x += colWidths[i];
      });
      y += 22;
    });

    const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
    const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);

    doc.moveDown(2);
    doc.fillColor('#16a34a').fontSize(14).text('MURI RUSANGE:', 30, y + 20);
    doc
      .fillColor('#000')
      .fontSize(11)
      .text(`Imirima: ${farms.length}`, 30, y + 45)
      .text(`Ingano yose: ${totalSize} ha`, 30, y + 62)
      .text(`Ibiti byose: ${totalTrees}`, 30, y + 79);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ============ PDF - ALL FARMS ============ */
router.get('/all-farms/pdf', protect, adminOnly, async (req, res) => {
  try {
    const farms = await Farm.find().populate(
      'userId',
      'username identityNumber telephone location'
    );

    const doc = new PDFDocument({
      margin: 30,
      size: 'A4',
      layout: 'landscape',
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=imirima_yose_${Date.now()}.pdf`
    );
    doc.pipe(res);

    doc
      .fillColor('#16a34a')
      .fontSize(24)
      .text('ABAHINZI PORTAL', { align: 'center' });
    doc
      .fillColor('#000')
      .fontSize(14)
      .text('Raporo y\'Imirima Yose', { align: 'center' });
    doc
      .fontSize(10)
      .fillColor('#666')
      .text(`Italiki: ${new Date().toLocaleDateString('rw-RW')}`, {
        align: 'center',
      });

    doc.moveDown(1.5);

    const tableTop = doc.y;
    const colWidths = [100, 120, 60, 90, 80, 55, 130];
    const headers = [
      'Nyir\'Umurima',
      'Izina ry\'Umurima',
      'Ingano',
      'Igihingwa',
      'Aho Uherereye',
      'Ibiti',
      'Ubwoko bw\'Ibiti',
    ];

    let x = 30;
    headers.forEach((h, i) => {
      doc.rect(x, tableTop, colWidths[i], 24).fill('#16a34a');
      doc
        .fillColor('#fff')
        .fontSize(9)
        .text(h, x + 4, tableTop + 7, { width: colWidths[i] - 8 });
      x += colWidths[i];
    });

    let y = tableTop + 24;
    farms.forEach((f, idx) => {
      x = 30;
      if (y > 520) {
        doc.addPage();
        y = 40;
      }
      if (idx % 2 === 0) {
        doc
          .rect(30, y, colWidths.reduce((a, b) => a + b), 22)
          .fill('#f0fdf4');
      }
      const row = [
        f.userId?.username || '-',
        f.farmName,
        String(f.size),
        f.cropType,
        f.location,
        String(f.treeCount || 0),
        (f.treeTypes || []).join(', ') || '-',
      ];
      row.forEach((cell, i) => {
        doc
          .fillColor('#000')
          .fontSize(8)
          .text(cell, x + 4, y + 6, {
            width: colWidths[i] - 8,
            ellipsis: true,
          });
        x += colWidths[i];
      });
      y += 22;
    });

    const totalSize = farms.reduce((a, f) => a + (f.size || 0), 0);
    const totalTrees = farms.reduce((a, f) => a + (f.treeCount || 0), 0);

    doc.moveDown(2);
    doc.fillColor('#16a34a').fontSize(14).text('MURI RUSANGE:', 30, y + 20);
    doc
      .fillColor('#000')
      .fontSize(11)
      .text(`Imirima: ${farms.length}`, 30, y + 45)
      .text(`Ingano yose: ${totalSize} ha`, 30, y + 62)
      .text(`Ibiti byose: ${totalTrees}`, 30, y + 79);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;