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

const normalizeRichTextHtml = text => {
  let normalized = String(text || "");

  normalized = normalized.replace(/\r\n/g, "\n");
  normalized = normalized.replace(/<br\s*\/?>/gi, "\n");

  normalized = normalized.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, body) => {
    let index = 0;
    return body.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, itemBody) => {
      index += 1;
      return `${index}. ${itemBody}\n`;
    });
  });

  normalized = normalized.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, body) =>
    body.replace(
      /<li[^>]*>([\s\S]*?)<\/li>/gi,
      (__, itemBody) => `• ${itemBody}\n`
    )
  );

  normalized = normalized.replace(/<\/p>/gi, "\n");
  normalized = normalized.replace(/<p[^>]*>/gi, "");
  normalized = normalized.replace(/<\/?span[^>]*>/gi, "");
  normalized = normalized.replace(/<\/?div[^>]*>/gi, "");
  normalized = normalized.replace(/<\/?u[^>]*>/gi, "");
  normalized = normalized.replace(/&nbsp;/gi, " ");
  normalized = normalized.replace(/&amp;/gi, "&");
  normalized = normalized.replace(/&lt;/gi, "<");
  normalized = normalized.replace(/&gt;/gi, ">");
  normalized = normalized.replace(/<\/?(?!strong|b|em|i)[^>]+>/gi, "");
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  return normalized.trim();
};

const tokenizeRichText = text => {
  const normalized = normalizeRichTextHtml(text);
  const parts = normalized.split(/(<\/?(?:strong|b|em|i)>)/gi);

  return parts
    .filter(part => part !== "")
    .map(part => {
      const lower = part.toLowerCase();

      if (lower === "<strong>" || lower === "<b>") {
        return { type: "tag", tag: "bold-open" };
      }
      if (lower === "</strong>" || lower === "</b>") {
        return { type: "tag", tag: "bold-close" };
      }
      if (lower === "<em>" || lower === "<i>") {
        return { type: "tag", tag: "italic-open" };
      }
      if (lower === "</em>" || lower === "</i>") {
        return { type: "tag", tag: "italic-close" };
      }

      return { type: "text", value: part };
    });
};

const getFontName = ({ isBold, isItalic }) => {
  if (isBold && isItalic) return "Helvetica-BoldOblique";
  if (isBold) return "Helvetica-Bold";
  if (isItalic) return "Helvetica-Oblique";
  return "Helvetica";
};

const renderRichText = (
  doc,
  { text, x, y, width, fontSize = 10, draw = true, color = "#000000" }
) => {
  const tokens = tokenizeRichText(text);
  const lineHeight = fontSize * 1.35;
  let cursorX = x;
  let cursorY = y;
  let isBold = false;
  let isItalic = false;

  const maxX = x + width;
  const newLine = () => {
    cursorX = x;
    cursorY += lineHeight;
  };

  const drawWord = word => {
    if (word === "") return;

    const fontName = getFontName({ isBold, isItalic });
    doc.font(fontName).fontSize(fontSize);
    const wordWidth = doc.widthOfString(word);

    if (cursorX !== x && cursorX + wordWidth > maxX) {
      newLine();
    }

    if (draw) {
      doc.fillColor(color).text(word, cursorX, cursorY, { lineBreak: false });
    }
    cursorX += wordWidth;
  };

  tokens.forEach(token => {
    if (token.type === "tag") {
      if (token.tag === "bold-open") isBold = true;
      if (token.tag === "bold-close") isBold = false;
      if (token.tag === "italic-open") isItalic = true;
      if (token.tag === "italic-close") isItalic = false;
      return;
    }

    const lines = token.value.split("\n");
    lines.forEach((line, lineIndex) => {
      const chunks = line.split(/(\s+)/).filter(Boolean);

      chunks.forEach(chunk => {
        if (/^\s+$/.test(chunk) && cursorX === x) {
          return;
        }
        drawWord(chunk);
      });

      if (lineIndex < lines.length - 1) {
        newLine();
      }
    });
  });

  return Math.max(lineHeight, cursorY - y + lineHeight);
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
    .text(text, x, y + 6, { width, align: "center" });
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
  const fontSize = 10.5;
  const textY = y + (rowHeight - fontSize) / 2 - 1;
  const leftWidth = (tableWidth - 1) * 0.2;
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
  const getSingleLineFontSize = (
    text,
    maxWidth,
    { base = 10.5, min = 7.5, step = 0.5 } = {}
  ) => {
    let fontSize = base;
    doc.font("Helvetica-Bold");
    while (fontSize > min) {
      doc.fontSize(fontSize);
      if (doc.widthOfString(String(safeText(text))) <= maxWidth) {
        break;
      }
      fontSize -= step;
    }
    return fontSize;
  };

  const calcRowHeight = (cells, isHeader = false) => {
    if (isHeader) {
      return 30;
    }
    const font = isHeader ? "Helvetica-Bold" : "Helvetica";
    const size = isHeader ? 10.5 : 10;
    return cells.reduce((max, cell, index) => {
      const cellText = String(safeText(cell));
      const h = isHeader
        ? doc
            .font(font)
            .fontSize(size)
            .heightOfString(cellText, {
              width: colWidths[index] - padding * 2
            })
        : renderRichText(doc, {
            text: cellText,
            x: 0,
            y: 0,
            width: colWidths[index] - padding * 2,
            fontSize: size,
            draw: false
          });
      return Math.max(max, h + padding * 2);
    }, 18);
  };

  const drawRow = ({ cells, isHeader, fillColor }) => {
    const rowHeight = calcRowHeight(cells, isHeader);
    if (y + rowHeight > pageLimit) {
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
      if (isHeader) {
        const textValue = String(safeText(cell));
        const fontSize = getSingleLineFontSize(textValue, w - padding * 2);
        const textY = y + (rowHeight - fontSize) / 2 - 1;
        doc
          .font("Helvetica-Bold")
          .fontSize(fontSize)
          .fillColor("#000000")
          .text(textValue, x + padding, textY, {
            width: w - padding * 2,
            lineBreak: false
          });
      } else {
        const textValue = String(safeText(cell));
        if (textValue.match(EMAIL_REGEX)) {
          renderTextWithEmailLink({
            doc,
            text: textValue,
            x: x + padding,
            y: y + padding,
            width: w - padding * 2
          });
        } else {
          renderRichText(doc, {
            text: textValue,
            x: x + padding,
            y: y + padding,
            width: w - padding * 2,
            fontSize: 10,
            draw: true
          });
        }
      }
      x += w;
    });
    y += rowHeight;
  };

  if (showHeader && columns.length > 0) {
    const headerCells = columns.map(col => col.label);
    const headerHeight = calcRowHeight(headerCells, true);
    const firstRowHeight =
      rows && rows.length > 0 ? calcRowHeight(rows[0], false) : 0;
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
  rows.forEach(row => drawRow({ cells: row }));
  return y;
};

const formatCategoryLabel = category => {
  if (!category) return "-";
  return toTitleCase(category);
};

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

const formatAssistants = assistants => {
  if (!Array.isArray(assistants) || assistants.length === 0) {
    return "-";
  }
  return assistants.map(formatPerson).join(", ");
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
      .text("COURSE OUTLINE", tableX, titleY + 10, {
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
        { label: "Code", widthRatio: 0.2 },
        { label: "Semester", widthRatio: 0.13 },
        { label: "Theory", widthRatio: 0.13 },
        { label: "Tutorial", widthRatio: 0.13 },
        { label: "Lab", widthRatio: 0.12 },
        { label: "Local Credits", widthRatio: 0.16 },
        { label: "ECTS", widthRatio: 0.13 }
      ],
      rows: [
        [
          outline.courseCode,
          toTitleCase(outline.semester),
          outline.theoryHours || 0,
          outline.tutorialHours || 0,
          outline.labHours || 0,
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
        { label: "Field", widthRatio: 0.32 },
        { label: "Value", widthRatio: 0.68 }
      ],
      rows: [
        [
          "Prerequisites / Course Level",
          `Prerequisites: ${
            outline.prerequisiteCourseCodes.length
              ? outline.prerequisiteCourseCodes.join(", ")
              : "-"
          }   Course Level: ${safeText(outline.courseLevelText)}`
        ],
        ["Language of Instruction", outline.courseLanguage],
        ["Course Lecturer(s)", formatPerson(outline.lecturer)],
        ["Assistant(s)", formatAssistants(outline.assistants)],
        ["Office Room", safeText(outline.officeCode)],
        ["Office Hours", safeText(outline.officeHours)],
        ["Mode of Delivery of the Course", "On-campus Course"],
        ["Course Category", formatCategoryLabel(outline.courseCategory)],
        [
          "Other Categories",
          "University Core, University Elective, Area Core, Area Elective, Faculty Core, Faculty Elective"
        ]
      ]
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "COURSE AIMS AND OBJECTIVES", y);
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
          "Course Aims and Objectives",
          outline.objectives
            .map(item => `${item.objectiveOrder}. ${item.objectiveText}`)
            .join("\n")
        ],
        [
          "Course Content",
          outline.contentItems.map(item => `- ${item.contentText}`).join("\n")
        ]
      ]
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "COURSE LEARNING OUTCOMES (CLOs)", y);
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
    y = renderSectionBar(doc, "EVALUATION OF THE COURSE", y);
    const evaluationTotal = outline.evaluationItems.reduce(
      (acc, item) => acc + Number(item.weightPercent || 0),
      0
    );
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Semester Requirements", widthRatio: 0.52 },
        { label: "Numbers", widthRatio: 0.16 },
        { label: "Percentage", widthRatio: 0.32 }
      ],
      rows: [
        ...outline.evaluationItems.map(item => [
          item.name,
          item.count === undefined ? "-" : item.count,
          `${Number(item.weightPercent || 0)}%`
        ]),
        ["Total", "-", `${evaluationTotal}%`]
      ]
    });

    if (y > doc.page.height - 300) {
      doc.addPage();
      y = PAGE.top;
    }
    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "WEEKLY TOPICS TO BE COVERED", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      columns: [
        { label: "Week", widthRatio: 0.08 },
        { label: "Subjects", widthRatio: 0.44 },
        { label: "CLOs", widthRatio: 0.14 },
        { label: "Tasks/Think Points for Private Study", widthRatio: 0.34 }
      ],
      rows: outline.weeklyTopics.map(topic => [
        topic.weekDate ? `${topic.weekNo}\n${topic.weekDate}` : topic.weekNo,
        `${topic.subjectTitle}\n- ${topic.detailsText}`,
        topic.clos.length
          ? topic.clos.map(clo => clo.cloNumber).join(",")
          : "-",
        parseApplication(topic.tasksPrivateStudyText)
      ])
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "COURSE TEXTBOOKS AND ADDITIONAL READING", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [
        { label: "Field", widthRatio: 0.24 },
        { label: "Details", widthRatio: 0.76 }
      ],
      rows: [
        ["Course Textbooks", safeText(outline.textbooksText)],
        ["Additional Reading Material", safeText(outline.additionalReadingText)]
      ]
    });

    y = ensureSpaceForSection(doc, y);
    y = renderSectionBar(doc, "POLICIES", y);
    y = renderTable(doc, {
      startX: tableX,
      startY: y,
      tableWidth,
      showHeader: false,
      columns: [{ label: "Policy", widthRatio: 1 }],
      rows: outline.policies.length
        ? outline.policies.map(policy => [
            `${policy.policyOrder}. ${policy.title}: ${policy.bodyText}`
          ])
        : [["-"]]
    });

    renderFooterStampOnAllPages(doc, outline);
    doc.end();
  });

module.exports = buildOutlinePdfBuffer;
