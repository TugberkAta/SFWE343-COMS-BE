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
const SECTION_BAR_HEIGHT = 24;
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
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

const formatPerson = person => {
  if (!person) return "-";
  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(" ");
  if (fullName && person.email) {
    return `${fullName} (${person.email})`;
  }
  return fullName || safeText(person.email);
};

const renderSectionBar = (doc, text, y) => {
  const x = PAGE.left;
  const width = doc.page.width - PAGE.left - PAGE.right;
  const h = SECTION_BAR_HEIGHT;
  doc
    .save()
    .rect(x, y, width, h)
    .fill(COLORS.sectionGray)
    .restore();
  doc.rect(x, y, width, h).stroke(COLORS.border);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(text, x, y + 6, {
      width,
      align: "center"
    });
  return y + h;
};

const ensureSpaceForSection = (doc, y, estimatedFirstRowHeight = 40) => {
  const pageLimit = doc.page.height - PAGE.bottom - FOOTER_RESERVED_HEIGHT;
  if (y + SECTION_BAR_HEIGHT + estimatedFirstRowHeight > pageLimit) {
    doc.addPage();
    return PAGE.top;
  }
  return y;
};

const renderTextWithEmailLink = ({
  doc,
  text,
  x,
  y,
  width,
  font = "Helvetica",
  fontSize = 10
}) => {
  const textValue = String(safeText(text));
  const emailMatch = textValue.match(EMAIL_REGEX);

  if (!emailMatch) {
    doc
      .font(font)
      .fontSize(fontSize)
      .fillColor("#000000")
      .text(textValue, x, y, { width });
    return;
  }

  const email = emailMatch[0];
  const emailStart = emailMatch.index || 0;
  const beforeEmail = textValue.slice(0, emailStart);
  const afterEmail = textValue.slice(emailStart + email.length);

  if (beforeEmail) {
    doc
      .font(font)
      .fontSize(fontSize)
      .fillColor("#000000")
      .text(beforeEmail, x, y, { width, continued: true });
  }

  doc
    .font(font)
    .fontSize(fontSize)
    .fillColor("#000000")
    .text(email, {
      continued: Boolean(afterEmail),
      link: `mailto:${email}`
    });

  if (afterEmail) {
    doc
      .font(font)
      .fontSize(fontSize)
      .fillColor("#000000")
      .text(afterEmail, { width });
  }

  doc.fillColor("#000000");
};

const renderCourseNameRow = (doc, { y, tableX, tableWidth, courseName }) => {
  const rowHeight = 30;
  const padding = 5;
  const fontSize = 10.2;
  const textY = y + (rowHeight - fontSize) / 2 - 1;
  const leftWidth = (tableWidth - 1) * 0.16;
  const rightWidth = tableWidth - leftWidth;

  doc
    .save()
    .rect(tableX, y, leftWidth, rowHeight)
    .fill(COLORS.rowGray)
    .restore();
  doc.rect(tableX, y, leftWidth, rowHeight).stroke(COLORS.border);
  doc.rect(tableX + leftWidth, y, rightWidth, rowHeight).stroke(COLORS.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(fontSize)
    .fillColor("#000000")
    .text("Course Name", tableX + padding, textY, {
      width: leftWidth - padding * 2
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(fontSize)
    .fillColor("#000000")
    .text(courseName, tableX + leftWidth + padding, textY, {
      width: rightWidth - padding * 2
    });

  return y + rowHeight;
};

const renderTable = (
  doc,
  { startX, startY, tableWidth, columns, rows, showHeader = true }
) => {
  let y = startY;
  const padding = 5;
  const colWidths = columns.map(col => (tableWidth - 1) * col.widthRatio);
  const pageLimit = doc.page.height - PAGE.bottom - FOOTER_RESERVED_HEIGHT;
  const normalizeCells = cells =>
    cells.map(cell => {
      if (cell && typeof cell === "object" && !Array.isArray(cell)) {
        return {
          value: cell.value,
          colSpan: Math.max(1, Number(cell.colSpan) || 1)
        };
      }
      return { value: cell, colSpan: 1 };
    });

  const calcHeight = (cells, isHeader = false) => {
    const font = isHeader ? "Helvetica-Bold" : "Helvetica";
    const size = isHeader ? 10.2 : 10;
    const normalizedCells = normalizeCells(cells);
    let columnIndex = 0;
    return normalizedCells.reduce((max, cell) => {
      const span = Math.min(cell.colSpan, colWidths.length - columnIndex);
      const cellWidth = colWidths
        .slice(columnIndex, columnIndex + span)
        .reduce((acc, width) => acc + width, 0);
      columnIndex += span;
      const h = doc
        .font(font)
        .fontSize(size)
        .heightOfString(String(safeText(cell.value)), {
          width: cellWidth - padding * 2
        });
      return Math.max(max, h + padding * 2);
    }, 18);
  };

  const drawRow = ({ cells, isHeader, fillColor }) => {
    const rowHeight = calcHeight(cells, isHeader);
    if (y + rowHeight > pageLimit) {
      doc.addPage();
      y = PAGE.top;
    }

    let x = startX;
    let columnIndex = 0;
    normalizeCells(cells).forEach(cell => {
      const span = Math.min(cell.colSpan, colWidths.length - columnIndex);
      const width = colWidths
        .slice(columnIndex, columnIndex + span)
        .reduce((acc, colWidth) => acc + colWidth, 0);
      if (fillColor) {
        doc
          .save()
          .rect(x, y, width, rowHeight)
          .fill(fillColor)
          .restore();
      }
      doc.rect(x, y, width, rowHeight).stroke(COLORS.border);
      const textValue = String(safeText(cell.value));
      if (!isHeader && textValue.match(EMAIL_REGEX)) {
        renderTextWithEmailLink({
          doc,
          text: textValue,
          x: x + padding,
          y: y + padding,
          width: width - padding * 2
        });
      } else {
        doc
          .font(isHeader ? "Helvetica-Bold" : "Helvetica")
          .fontSize(isHeader ? 10.2 : 10)
          .fillColor("#000000")
          .text(textValue, x + padding, y + padding, {
            width: width - padding * 2
          });
      }
      x += width;
      columnIndex += span;
    });
    y += rowHeight;
  };

  if (showHeader && columns.length > 0) {
    const headerCells = columns.map(col => col.label);
    const headerHeight = calcHeight(headerCells, true);
    const firstRowHeight =
      rows && rows.length > 0 ? calcHeight(rows[0], false) : 0;
    if (y + headerHeight + firstRowHeight > pageLimit) {
      doc.addPage();
      y = PAGE.top;
    }
  }

  if (showHeader && columns.length > 0) {
    drawRow({
      cells: columns.map(col => col.label),
      isHeader: true,
      fillColor: COLORS.rowGray
    });
  }

  rows.forEach(row => drawRow({ cells: row, isHeader: false }));
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
      .text(label, leftX, textY, {
        width: width * 0.7,
        align: "left"
      });
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
      .text(url, leftX, urlY, {
        width: width * 0.85,
        align: "left"
      });
  });
};

const buildCourseSpecificationPdfBuffer = outline =>
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
        { width: tableWidth, align: "center" }
      );

    const stripY = titleY + titleHeight;
    doc
      .save()
      .rect(tableX, stripY, tableWidth, redStripHeight)
      .fill(COLORS.accentRed)
      .restore();
    doc.rect(tableX, stripY, tableWidth, redStripHeight).stroke(COLORS.border);

    y = headerStartY + headerTotalHeight;
    y = renderCourseNameRow(doc, {
      y: y + 1,
      tableX,
      tableWidth,
      courseName: `${outline.courseCode} - ${outline.courseName}`
    });

    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Code", widthRatio: 0.16 },
        { label: "Year", widthRatio: 0.14 },
        { label: "Semester", widthRatio: 0.14 },
        { label: "In-Class Hours (L,T,L)", widthRatio: 0.24 },
        { label: "Credit", widthRatio: 0.16 },
        { label: "ECTS Credit", widthRatio: 0.16 }
      ],
      rows: [
        [
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

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "GENERAL INFORMATION", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [
        { label: "Field", widthRatio: 0.33 },
        { label: "Value", widthRatio: 0.67 }
      ],
      rows: [
        ["Language of Instruction", outline.courseLanguage],
        ["Level of the Course", safeText(outline.courseLevelText)],
        ["Type of the Course", toTitleCase(outline.courseCategory)],
        ["Mode of Delivery of the Course", "On-campus Course"],
        ["Coordinator of the Course", "-"],
        ["Instructor(s) of the Course", formatPerson(outline.lecturer)]
      ]
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(
      doc,
      "PREREQUISITES AND/OR CO-REQUISITIES OF THE COURSE",
      y
    );
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [{ label: "Prerequisite", widthRatio: 1 }],
      rows: [
        [
          `Prerequisite course: ${
            outline.prerequisiteCourseCodes.length
              ? outline.prerequisiteCourseCodes.join(", ")
              : "-"
          }`
        ]
      ]
    });

    y = ensureSpaceForSection(doc, y);
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
          outline.contentItems.map(item => `• ${item.contentText}`).join("\n")
        ]
      ]
    });

    y = ensureSpaceForSection(doc, y);
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

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "WEEKLY TOPICS TO BE COVERED", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Week", widthRatio: 0.08 },
        { label: "Subjects", widthRatio: 0.45 },
        { label: "CLOs", widthRatio: 0.12 },
        { label: "Application", widthRatio: 0.35 }
      ],
      rows: outline.weeklyTopics.map(topic => [
        topic.weekNo,
        `${topic.subjectTitle}\n- ${safeText(topic.detailsText)}`,
        topic.clos.length
          ? topic.clos.map(clo => clo.cloNumber).join(",")
          : "-",
        parseApplication(topic.tasksPrivateStudyText)
      ])
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(
      doc,
      "STUDENT WORKLOAD & ECTS CREDIT OF THE COURSE",
      y
    );
    const workload = formatWorkload(outline.workloadItems || []);
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
        [
          { value: "Total Workload of the Course Unit", colSpan: 3 },
          workload.totalWorkload
        ],
        [
          { value: "Total Workload of the Course Unit /25", colSpan: 3 },
          workload.workloadOver25.toFixed(2)
        ],
        [
          {
            value: "ECTS Credits allocated for the Course Unit",
            colSpan: 3
          },
          outline.ectsCredits
        ]
      ]
    });

    renderFooterStampOnAllPages(doc, outline);
    doc.end();
  });

module.exports = buildCourseSpecificationPdfBuffer;
