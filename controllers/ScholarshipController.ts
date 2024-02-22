import { format } from "date-fns";
import CONSTANT from "../config";
import Scholarship from "../models/ScholarshipModel";
import {
  CreateOrEdiScholarshipRequest,
  DeleteScholarshipRequest,
  GetScholarshipRequest,
} from "../typings";
import ExcelJS from "exceljs";
export class ScholarshipController {
  //GET
  async getScholarship(params: GetScholarshipRequest) {
    try {
      return await Scholarship.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listScholarship() {
    try {
      return await Scholarship.findAll({ order: [["id", "desc"]] });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteScholarship(payload: DeleteScholarshipRequest) {
    try {
      return await Scholarship.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditScholarship(payload: CreateOrEdiScholarshipRequest) {
    try {
      let scholarship: Scholarship;
      if (payload.id) {
        const res = await Scholarship.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        scholarship = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<Scholarship>(
          scholarship,
          "Scholarship edited successfully"
        );
      } else {
        scholarship = await Scholarship.create({
          name: payload.name,
          duration: payload.duration,
          dateFrom: payload.dateFrom,
          dateTo: payload.dateTo,
          value: payload.value,
          condition_obtention: payload.condition_obtention,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<Scholarship>(
          scholarship,
          "Scholarship created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  async exportToExcel() {
    try {
      // Fetch all scholarships from the database
      const scholarships = await Scholarship.findAll({
        order: [["id", "desc"]],
      });
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Scholarships");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "Id", key: "id", width: 10 },
        { header: "Name", key: "name", width: 30 },
        { header: "Duration", key: "duration", width: 30 },
        { header: "Start Date", key: "dateFrom", width: 30 },
        { header: "End Date", key: "dateTo", width: 30 },
        { header: "Value", key: "value", width: 30 },
        { header: "Condition Obtenu", key: "condition_obtention", width: 30 },
        // Add more columns as necessary
      ];

      // Add rows to the worksheet from the fetched universities
      scholarships.forEach((Scholarship) => {
        const ScholarshipDetail = {
          ...Scholarship.toJSON(),
          dateFrom: format(Scholarship.dateFrom, "PPP"),
          dateTo: format(Scholarship.dateTo, "PPP"),
        };
        worksheet.addRow(ScholarshipDetail);
      });
      return workbook;
    } catch (error) {
      throw error;
    }
  }

  // BULK ADD FROM EXCEL
  async importFromExcel(workbook: ExcelJS.Workbook) {
    try {
      const worksheet = workbook.getWorksheet(1); // Get the first worksheet
      if (!worksheet) throw "Empty Workbook";
      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber > 1) {
          // Assuming the first row is headers
          // Extract data from each row to create a Scholarship entry
          const department_name = row.getCell(1).value;
          // Add more fields as necessary

          // Create Scholarship entry in the database
          try {
            await Scholarship.create({
              department_name,
            });
          } catch (error) {
            console.error("Error creating Scholarship entry:", error);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
export const scholarshipController = new ScholarshipController();
