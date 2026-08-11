import ExcelJS from "exceljs";

export const readExcelAsJson = async (
  filePath
) => {
  console.log(filePath);
  
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.readFile(filePath);

  const result = {};

  workbook.eachSheet((worksheet) => {
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      rows.push({
        rowNumber,
        values: row.values,
      });
    });

    result[worksheet.name] = rows;
  });

  return result;
};