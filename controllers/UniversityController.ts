import CONSTANT from "../config";
import University from "../models/UniversityModel";
import {
  CreateOrEditUniversityRequest,
  DeleteUniversityRequest,
  GetUniversityRequest,
} from "../typings";
import ExcelJS from "exceljs";
export class UniversityController {
  //GET
  async getUniversity(params: GetUniversityRequest) {
    try {
      return await University.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listUniversity() {
    try {
      return await University.findAll({ order: [["id", "desc"]] });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteUniversity(payload: DeleteUniversityRequest) {
    try {
      return await University.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditUniversity(payload: CreateOrEditUniversityRequest) {
    try {
      let university: University;
      if (payload.id) {
        const res = await University.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        university = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<University>(
          university,
          "University edited successfully"
        );
      } else {
        university = await University.create({
          university_name: payload.university_name,
          country: payload.country,
          website: payload.website,
          is_free: payload.is_free,
          convention_info: payload.convention_info,
          convention_date: payload.convention_date,
          procedure_inscription: payload.procedure_inscription,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<University>(
          university,
          "University created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  async exportToExcel() {
    try {
      // Fetch all universities from the database
      const universities = await University.findAll({
        order: [["id", "desc"]],
      });
      console.log(universities);
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Universities");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "Id", key: "id", width: 10 },
        { header: "Name", key: "university_name", width: 30 },
        { header: "Country", key: "country", width: 30 },
        { header: "Website", key: "website", width: 30 },
        { header: "Public Unvisity", key: "is_free", width: 30 },
        { header: "convention_info", key: "convention_info", width: 30 },
        { header: "convention_date", key: "convention_date", width: 30 },
        {
          header: "procedure_inscription",
          key: "procedure_inscription",
          width: 30,
        },

        // Add more columns as necessary
      ];

      // Add rows to the worksheet from the fetched universities
      universities.forEach((university) => {
        const universityDetail = university.toJSON();
        console.log(universityDetail.is_free);
        universityDetail.is_free = universityDetail.is_free ? "Yes" : "No";
        worksheet.addRow(universityDetail);
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
          // Extract data from each row to create a university entry
          const university_name = row.getCell(1).value;
          const country = row.getCell(2).value;
          // Add more fields as necessary

          // Create university entry in the database
          try {
            await University.create({
              university_name,
              country,
            });
          } catch (error) {
            console.error("Error creating university entry:", error);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
export const universityController = new UniversityController();
