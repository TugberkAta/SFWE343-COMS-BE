const PDFDocument = require("pdfkit");
const path = require("path");

const COLORS = {
  border: "#000000",
  sectionGray: "#d9d9d9",
  rowGray: "#efefef",
  accentRed: "#c00000"
};

const PAGE = { left: 45, right: 45, top: 36, bottom: 36 };
const BANNER_PATH = path.join(__dirname, "../../public/final-banner.png");
const FOOTER_RESERVED_HEIGHT = 54;
const safeText = value => (value === null || value === undefined ? "-" : value);

const toTitleCase = text =>
  String(text || "")
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const parseApplication = text =>
  String(text || "")
    .replace(/^Application:\s*/i, "")
    .trim();

const renderSectionBar = (doc, text, y) => {
  const x = PAGE.left;
  const width = doc.page.width - PAGE.left - PAGE.right;
  const h = 24;
  doc
    .save()
    .rect(x, y, width, h)
    .fill(COLORS.sectionGray)
    .restore();
  doc.rect(x, y, width, h).stroke(COLORS.border);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(text, x, y + 6, { width, align: "center" });
  return y + h;
};

const renderTable = (
  doc,
  { startX, startY, tableWidth, columns, rows, showHeader = true }
) => {
  let y = startY;
  const padding = 5;
  const colWidths = columns.map(col => (tableWidth - 1) * col.widthRatio);

  const calcRowHeight = (cells, isHeader = false) => {
    const font = isHeader ? "Helvetica-Bold" : "Helvetica";
    const size = isHeader ? 10.5 : 10;
    return cells.reduce((max, cell, index) => {
      const h = doc
        .font(font)
        .fontSize(size)
        .heightOfString(String(safeText(cell)), {
          width: colWidths[index] - padding * 2
        });
      return Math.max(max, h + padding * 2);
    }, 18);
  };

  const drawRow = ({ cells, isHeader, fillColor }) => {
    const rowHeight = calcRowHeight(cells, isHeader);
    if (
      y + rowHeight >
      doc.page.height - PAGE.bottom - FOOTER_RESERVED_HEIGHT
    ) {
      doc.addPage();
      y = PAGE.top;
    }
    let x = startX;
    cells.forEach((cell, index) => {
      const w = colWidths[index];
      if (fillColor)
        doc
          .save()
          .rect(x, y, w, rowHeight)
          .fill(fillColor)
          .restore();
      doc.rect(x, y, w, rowHeight).stroke(COLORS.border);
      doc
        .font(isHeader ? "Helvetica-Bold" : "Helvetica")
        .fontSize(isHeader ? 10.5 : 10)
        .fillColor("#000000")
        .text(String(safeText(cell)), x + padding, y + padding, {
          width: w - padding * 2
        });
      x += w;
    });
    y += rowHeight;
  };

  if (showHeader && columns.length > 0) {
    drawRow({
      cells: columns.map(col => col.label),
      isHeader: true,
      fillColor: COLORS.rowGray
    });
  }
  rows.forEach(row => drawRow({ cells: row }));
  return y;
};

const formatWorkload = workloadItems => {
  const rows = workloadItems.map(item => {
    const workload =
      Number(item.learningActivitiesWeeks) * Number(item.durationHours);
    return { ...item, workload };
  });
  const totalWorkload = rows.reduce((acc, row) => acc + row.workload, 0);
  return { rows, totalWorkload, workloadOver25: totalWorkload / 25 };
};

const renderFooterStampOnAllPages = (doc, outline) => {
  const reference = (outline.referenceLinks && outline.referenceLinks[0]) || {};
  const label = safeText(reference.label);
  const url = safeText(reference.url);
  const pageRange = doc.bufferedPageRange();
  const totalPages = pageRange.count;

  Array.from({ length: totalPages }).forEach((_, idx) => {
    doc.switchToPage(pageRange.start + idx);

    const footerTop = doc.page.height - PAGE.bottom - FOOTER_RESERVED_HEIGHT;
    const lineY = footerTop + 8;
    const textY = footerTop + 16;
    const urlY = footerTop + 30;
    const leftX = PAGE.left;
    const rightX = doc.page.width - PAGE.right;
    const width = rightX - leftX;

    doc
      .save()
      .moveTo(leftX, lineY)
      .lineTo(rightX, lineY)
      .lineWidth(0.8)
      .strokeColor("#8e8e8e")
      .stroke()
      .restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#6a6a6a")
      .text(label, leftX, textY, { width: width * 0.7, align: "left" });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#6a6a6a")
      .text(`Page ${idx + 1} of ${totalPages}`, leftX, textY, {
        width,
        align: "right"
      });
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor("#6a6a6a")
      .text(url, leftX, urlY, { width: width * 0.85, align: "left" });
  });
};

const buildOutlinePdfBuffer = outline =>
  new Promise(resolve => {
    const doc = new PDFDocument({
      size: "A4",
      bufferPages: true,
      margins: {
        top: PAGE.top,
        left: PAGE.left,
        right: PAGE.right,
        bottom: PAGE.bottom
      }
    });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const tableX = PAGE.left;
    const tableWidth = doc.page.width - PAGE.left - PAGE.right;
    let y = PAGE.top;

    const headerStartY = y;
    const bannerHeight = 62;
    const titleHeight = 78;
    const redStripHeight = 16;
    const headerTotalHeight = bannerHeight + titleHeight + redStripHeight;

    // Outer frame like the original template top block.
    doc
      .rect(tableX, headerStartY, tableWidth, headerTotalHeight)
      .stroke(COLORS.border);

    try {
      doc.image(BANNER_PATH, tableX + 1, headerStartY + 1, {
        width: tableWidth - 2,
        height: bannerHeight - 2
      });
    } catch (err) {
      doc
        .save()
        .rect(tableX, headerStartY, tableWidth, bannerHeight)
        .fill(COLORS.sectionGray)
        .restore();
    }

    const titleY = headerStartY + bannerHeight;
    doc.rect(tableX, titleY, tableWidth, titleHeight).stroke(COLORS.border);
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("COURSE SPECIFICATION", tableX, titleY + 10, {
        width: tableWidth,
        align: "center"
      });
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        `${outline.courseCode} - ${outline.courseName}`,
        tableX,
        titleY + 42,
        {
          width: tableWidth,
          align: "center"
        }
      );

    const stripY = titleY + titleHeight;
    doc
      .save()
      .rect(tableX, stripY, tableWidth, redStripHeight)
      .fill(COLORS.accentRed)
      .restore();
    doc.rect(tableX, stripY, tableWidth, redStripHeight).stroke(COLORS.border);

    y = headerStartY + headerTotalHeight;
    y = renderTable(doc, {
      startX: tableX,
      startY: y + 1,
      tableWidth,
      columns: [
        { label: "Name of the Course Unit", widthRatio: 0.22 },
        { label: "Code", widthRatio: 0.13 },
        { label: "Year", widthRatio: 0.13 },
        { label: "Semester", widthRatio: 0.11 },
        { label: "In-Class Hours (L, T, L)", widthRatio: 0.17 },
        { label: "Credit", widthRatio: 0.12 },
        { label: "ECTS Credit", widthRatio: 0.12 }
      ],
      rows: [
        [
          toTitleCase(outline.courseName),
          outline.courseCode,
          outline.academicYear,
          toTitleCase(outline.semester),
          `${outline.theoryHours || 0}, ${outline.tutorialHours ||
            0}, ${outline.labHours || 0}`,
          outline.localCredits,
          outline.ectsCredits
        ]
      ]
    });

    y = renderSectionBar(doc, "GENERAL INFORMATION", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [
        { label: "Field", widthRatio: 0.34 },
        { label: "Value", widthRatio: 0.66 }
      ],
      rows: [
        ["Language of Instruction", outline.courseLanguage],
        ["Level of the Course", outline.courseLevelText || "-"],
        ["Type of the Course", toTitleCase(outline.courseCategory)],
        ["Mode of Delivery of the Course", "On-campus Course"],
        ["Coordinator of the Course", "-"]
      ]
    });

    y = renderSectionBar(
      doc,
      "PREREQUISITES AND/OR CO-REQUISITIES OF THE COURSE",
      y
    );
    const prerequisiteLabel = outline.prerequisiteCourseCodes.length
      ? outline.prerequisiteCourseCodes.join(", ")
      : "-";
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [{ label: "Prerequisite", widthRatio: 1 }],
      rows: [[`Prerequisite course: ${prerequisiteLabel}`]]
    });

    y = renderSectionBar(doc, "OBJECTIVES AND CONTENTS OF THE COURSE", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [
        { label: "Section", widthRatio: 0.2 },
        { label: "Details", widthRatio: 0.8 }
      ],
      rows: [
        [
          "Aims and Objectives",
          outline.objectives
            .map(item => `${item.objectiveOrder}. ${item.objectiveText}`)
            .join("\n")
        ],
        [
          "Content of the Course",
          outline.contentItems.map(item => `- ${item.contentText}`).join("\n")
        ]
      ]
    });

    y = renderSectionBar(doc, "KEY COURSE LEARNING OUTCOMES (CLOs)", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [
        { label: "No", widthRatio: 0.1 },
        { label: "Course Learning Outcomes", widthRatio: 0.9 }
      ],
      rows: outline.learningOutcomes.map(outcome => [
        outcome.cloNumber,
        outcome.statement
      ])
    });

    if (y > doc.page.height - 300) {
      doc.addPage();
      y = PAGE.top;
    }
    y = renderSectionBar(doc, "WEEKLY TOPICS TO BE COVERED", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Week", widthRatio: 0.08 },
        { label: "Subjects", widthRatio: 0.44 },
        { label: "CLOs", widthRatio: 0.14 },
        { label: "Application", widthRatio: 0.34 }
      ],
      rows: outline.weeklyTopics.map(topic => [
        topic.weekNo,
        `${topic.subjectTitle}\n- ${topic.detailsText}`,
        topic.clos.length
          ? topic.clos.map(clo => clo.cloNumber).join(",")
          : "-",
        parseApplication(topic.tasksPrivateStudyText)
      ])
    });

    y = renderSectionBar(
      doc,
      "STUDENT WORKLOAD & ECTS CREDIT OF THE COURSE",
      y
    );
    const workload = formatWorkload(outline.workloadItems);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Type of the Learning Activities", widthRatio: 0.44 },
        { label: "Learning Activities (# of week)", widthRatio: 0.18 },
        { label: "Duration (hours, h)", widthRatio: 0.18 },
        { label: "Workload", widthRatio: 0.2 }
      ],
      rows: [
        ...workload.rows.map(item => [
          item.activityType,
          item.learningActivitiesWeeks,
          Number(item.durationHours),
          item.workload
        ]),
        ["Total Workload of the Course Unit", "", "", workload.totalWorkload],
        [
          "Total Workload of the Course Unit / 25",
          "",
          "",
          workload.workloadOver25.toFixed(2)
        ],
        [
          "ECTS Credits allocated for the Course Unit",
          "",
          "",
          outline.ectsCredits
        ]
      ]
    });

    renderFooterStampOnAllPages(doc, outline);
    doc.end();
  });

module.exports = buildOutlinePdfBuffer;
