import { format } from "date-fns";
import CONSTANT from "../config";
import StudentsInscription from "../models/StudentsInscriptionModel";
import {
  CreateOrEditStudentsInscriptionRequest,
  DeleteStudentsInscriptionRequest,
  GetStudentsInscriptionRequest,
} from "../typings";
import ExcelJS from "exceljs";
import Masters from "../models/MastersModel";
import University from "../models/UniversityModel";
import Students from "../models/StudentsModel";
import { Op } from "sequelize";
import Scholarship from "../models/ScholarshipModel";

export class StudentsInscriptionController {
  //GET
  async getStudentsInscription(params: GetStudentsInscriptionRequest) {
    try {
      return await StudentsInscription.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listStudentsInscription() {
    try {
      return await StudentsInscription.findAll({
        order: [["id", "desc"]],
        attributes: [
          "id",
          "student_id",
          "master_id",
          "university_id",
          "is_admitted",
          "is_confirmed",
          "has_scholarship",
        ],
        include: [{ model: Students }, { model: University }],
      });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteStudentsInscription(payload: DeleteStudentsInscriptionRequest) {
    try {
      return await StudentsInscription.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditStudentsInscription(
    payload: CreateOrEditStudentsInscriptionRequest
  ) {
    try {
      let student_inscription: StudentsInscription;
      if (payload.id) {
        const res = await StudentsInscription.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        student_inscription = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<StudentsInscription>(
          student_inscription,
          "Students Inscription edited successfully"
        );
      } else {
        student_inscription = await StudentsInscription.create({
          ...payload,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<StudentsInscription>(
          student_inscription,
          "Students Inscription created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  //list inscrit | list autorise | waiting list | accepted list | will travel list
  async exportToExcel(
    type:
      | "inscrit" //enrolled
      | "autorise-elligible" //eligble
      | "non-autorise-list-attente" //NOT ELLIGILE enrolled + non autorise
      | "admis" //is admitted
      | "will-travel" //entrolled + accepted + confirmed
      | "boursier"
  ) {
    try {
      const workbook = new ExcelJS.Workbook();
      if (type === "admis") return await this.exportAdmis(workbook, type);
      return await this.exportHelper(workbook, type);

      return workbook;
    } catch (error) {
      throw error;
    }
  }
  async exportHelper(
    workbook: ExcelJS.Workbook,
    type:
      | "inscrit"
      | "autorise-elligible"
      | "admis"
      | "non-autorise-list-attente" //NOT ELLIGILE
      | "will-travel"
      | "boursier"
  ): Promise<ExcelJS.Workbook> {
    try {
      // Fetch all masters from the database
      const mastersMap = new Map<number, Masters>();
      const masters = await Masters.findAll({
        order: [["id", "desc"]],
        include: [
          {
            model: Scholarship,
          },
        ],
      });
      masters.forEach((master) => mastersMap.set(master.id, master));
      // Fetch all masters from the database
      const unisersityMap = new Map<number, University>();
      const universities = await University.findAll({
        order: [["id", "desc"]],
      });
      universities.forEach((uni) => unisersityMap.set(uni.id, uni));
      // Create a new workbook and a worksheet
      const Department = [
        {
          type: "GE",
          name: "Departement Electrique",
        },
        {
          type: "GM",
          name: "Departement Mecanique",
        },
        {
          type: "GC",
          name: "Departement Civile",
        },
        {
          type: "GP",
          name: "Departement Petro",
        },
      ];
      const branches = [
        {
          type: 1,
          name: "ULFG I",
        },
        {
          type: 2,
          name: "ULFG II",
        },
        {
          type: 3,
          name: "ULFG III",
        },
      ];
      for (const dept of Department) {
        let columnNamesGlobal: any[] = []; //used for will travel
        let studentRowsGlobal: any[] = []; //used for will travel
        const worksheet = workbook.addWorksheet(dept.name);
        const includeScholarshipCondition =
          type === "boursier"
            ? [
                {
                  model: StudentsInscription,
                  where: {
                    has_scholarship: true, //has scholarship //filtering
                  },
                  required: true,
                },
              ]
            : [{ model: StudentsInscription }];
        const thirdYearStudents = await Students.findAll({
          where: {
            annee: 3,
          },
          include: includeScholarshipCondition,
        });
        const fourthYearStudents = await Students.findAll({
          where: {
            annee: 4,
          },
          include: includeScholarshipCondition,
        });
        //3RD YEAR
        let i = 0;
        let headerRow = 0;
        for (const sourceStudents of [thirdYearStudents, fourthYearStudents]) {
          i++;
          const isThird = i === 1;

          if (!isThird && type !== "will-travel") {
            headerRow += 5;
          }

          for (const branch of branches) {
            // Adding introductory information
            if (type !== "will-travel") headerRow += 2;
            if (type !== "will-travel") {
              const branchRow = worksheet.getRow(headerRow + 1);
              branchRow.getCell(1).value = branch.name; // Assuming 'branch' is an object with a 'name' property
              // worksheet.mergeCells("A1:B1"); // Merge if you want the title to span more columns

              const deptRow = worksheet.getRow(headerRow + 2);
              deptRow.getCell(1).value = dept.name; // Assuming 'dept' is an object with a 'name' property
              deptRow.getCell(2).value = isThird ? "3eme Annee" : "4eme Annee";
              // worksheet.mergeCells("A2:B2"); // Merge if necessary

              //filtering
              const studentCount = sourceStudents.filter((st) => {
                if (type === "autorise-elligible") {
                  return (
                    st.eligible && //authorized
                    st.branch === branch.type &&
                    st.departement === dept.type
                  );
                }
                if (type === "non-autorise-list-attente") {
                  return (
                    !st.eligible && //not authorized
                    st.branch === branch.type &&
                    st.departement === dept.type &&
                    st.StudentsInscriptions?.length //enrolled
                  );
                }

                return (
                  st.branch === branch.type && st.departement === dept.type
                );
              }).length;
              const studentCountRow = worksheet.getRow(headerRow + 3);
              studentCountRow.getCell(1).value = "Nombre d'etudiants";
              studentCountRow.getCell(2).value = studentCount;
              const inscritStudentsRow = worksheet.getRow(headerRow + 4);
              //filtering

              const studentsInscritNumber = sourceStudents.filter((st) => {
                if (type === "autorise-elligible") {
                  return (
                    st.StudentsInscriptions?.length &&
                    st.eligible &&
                    st.branch === branch.type &&
                    st.departement === dept.type
                  );
                }
                if (type === "non-autorise-list-attente") {
                  return (
                    !st.eligible && //not authorized
                    st.branch === branch.type &&
                    st.departement === dept.type &&
                    st.StudentsInscriptions?.length //enrolled
                  );
                }
                return (
                  st.StudentsInscriptions?.length &&
                  st.branch === branch.type &&
                  st.departement === dept.type
                );
              }).length;
              inscritStudentsRow.getCell(1).value = "Nombre inscrist";
              inscritStudentsRow.getCell(2).value = studentsInscritNumber;

              if (type === "autorise-elligible") {
                // Add a row with the static text and the calculated total
                const nombreAuthorise = worksheet.getRow(headerRow + 5);
                nombreAuthorise.getCell(1).value = "Nombre d'autorisés 25%";
                nombreAuthorise.getCell(2).value = Math.ceil(
                  studentCount * 0.25
                );
                headerRow += 1;
              }
            }
            //filtering
            const inscritsStudents = sourceStudents.filter((st) => {
              if (type === "autorise-elligible") {
                return (
                  st.StudentsInscriptions &&
                  st.branch === branch.type &&
                  st.departement === dept.type &&
                  st.eligible
                );
              }
              if (type === "non-autorise-list-attente") {
                return (
                  st.StudentsInscriptions?.length && //enrolled
                  st.branch === branch.type &&
                  st.departement === dept.type &&
                  !st.eligible //not elligible
                );
              }
              if (type === "will-travel") {
                return (
                  st.branch === branch.type &&
                  st.departement === dept.type &&
                  st.eligible
                );
              }

              return (
                st.StudentsInscriptions &&
                st.branch === branch.type &&
                st.departement === dept.type
              );
            });

            const studentRows = [];
            for (const student of inscritsStudents) {
              if (student.StudentsInscriptions?.length) {
                for (const ins of student.StudentsInscriptions) {
                  //will travel
                  if (type === "will-travel") {
                    /*
                    Student
                    Type
                    Average
                    Email
                    Department
                    Branch
                    Parcours
                    Year
                    University
                    */
                    //filtering
                    if (!ins.is_confirmed || !ins.is_admitted) continue; //enrolled + confirmed + accepted
                    studentRows.push([
                      student.name + " " + student.family_name,
                      mastersMap.get(ins.master_id)!.type_diploma,
                      student.average,
                      student.email,
                      dept.name,
                      branch.name,
                      mastersMap.get(ins.master_id)!.name, //Parcours
                      student.annee,
                      unisersityMap.get(ins.university_id)!.university_name,
                    ]);
                  } else if (type === "boursier") {
                    //filtering

                    studentRows.push([
                      student.name + " " + student.family_name,
                      mastersMap.get(ins.master_id)!.type_diploma,
                      student.average,
                      student.email,
                      "yes",
                      unisersityMap.get(ins.university_id)!.university_name,
                      "",
                      "",
                      mastersMap.get(ins.master_id)?.Scholarship?.name || "N/A",
                    ]);
                  } else {
                    studentRows.push([
                      student.name + " " + student.family_name,
                      mastersMap.get(ins.master_id)!.type_diploma,
                      student.average,
                      student.email,
                      type === "non-autorise-list-attente" ? "no" : "yes",
                      unisersityMap.get(ins.university_id)!.university_name,
                      "",
                      "",
                    ]);
                  }
                }
              } else if (type === "non-autorise-list-attente") {
                studentRows.push([
                  student.name + " " + student.family_name,
                  "N/A",
                  student.average,
                  student.email,
                  "No",
                  "N/A",
                  "",
                  "",
                ]);
              }
            }

            // Define columns in the worksheet
            let columns = [
              { name: "Student Name", filterButton: false },
              { name: "Type ", filterButton: false },
              { name: "Average", filterButton: false },
              { name: "Email", filterButton: false },
              {
                name: type === "inscrit" ? "inscrit" : "autorise",
                filterButton: false,
              },
              {
                name: "University Name 1",

                filterButton: false,
              },
              {
                name: "University Name 2",
                filterButton: false,
              },
              {
                name: "University Name 3",
                filterButton: false,
              },
            ];
            if (type === "boursier") {
              columns.push({ name: "Scholarship Name", filterButton: false });
            }
            if (type === "will-travel") {
              columns = [
                { name: "Student Name", filterButton: false },
                { name: "Type ", filterButton: false },
                { name: "Average", filterButton: false },
                { name: "Email", filterButton: false },
                { name: "Department", filterButton: false },
                { name: "Branch", filterButton: false },
                { name: "Parcours", filterButton: false },
                {
                  name: "Year",
                  filterButton: false,
                },
                {
                  name: "University D'acceuil",

                  filterButton: false,
                },
              ];
            }
            columnNamesGlobal = columns;
            if (studentRows.length) {
              const startingIndex = type === "will-travel" ? 5 : 6;
              if (type === "will-travel") {
                studentRowsGlobal = studentRowsGlobal.concat(studentRows);
              } else {
                worksheet.addTable({
                  name: `${isThird ? "third" : "fourth"}_Branch_${
                    branch.type
                  }_Dept_${dept.type}`,
                  ref: `A${headerRow + startingIndex}`,
                  headerRow: true,
                  totalsRow: false,

                  columns,
                  rows: studentRows,
                  style: { showRowStripes: true },
                });
              }
            }
            if (type !== "will-travel") headerRow += studentRows.length + 5;
          }
        }
        if (type === "will-travel") {
          if (!studentRowsGlobal.length) {
            const branchRow = worksheet.getRow(headerRow + 1);
            branchRow.getCell(1).value = "No students"; // Assuming 'branch' is an object with a 'name' property
            continue;
          }
          worksheet.addTable({
            name: `Dept_${dept.type}`,
            ref: `A1`,
            headerRow: true,
            totalsRow: false,
            columns: columnNamesGlobal,
            rows: studentRowsGlobal,
            style: { showRowStripes: true },
          });
        }
      }
      return workbook;
    } catch (error) {
      console.log(error);
      return workbook;
    }
  }
  async exportAdmis(
    workbook: ExcelJS.Workbook,
    type:
      | "inscrit"
      | "autorise-elligible"
      | "admis"
      | "non-autorise-list-attente" //NOT ELLIGILE
      | "will-travel"
  ): Promise<ExcelJS.Workbook> {
    try {
      // Fetch all masters from the database
      const mastersMap = new Map<number, Masters>();
      const masters = await Masters.findAll({
        order: [["id", "desc"]],
        include: [
          {
            model: Scholarship,
          },
        ],
      });
      masters.forEach((master) => mastersMap.set(master.id, master));
      // Fetch all masters from the database
      const unisersityMap = new Map<number, University>();
      const universities = await University.findAll({
        order: [["id", "desc"]],
      });
      universities.forEach((uni) => unisersityMap.set(uni.id, uni));
      // Create a new workbook and a worksheet
      const DiplomeType = [
        {
          type: "DD",
          name: "Double Diplome",
        },
        {
          type: "M2R",
          name: "Master de Recherche",
        },
      ];

      for (const diploma_type of DiplomeType) {
        const worksheet = workbook.addWorksheet(diploma_type.name);
        let admittedStudents = await Students.findAll({
          where: {
            annee: {
              [Op.in]: [3, 4],
            },
            eligible: true, //authorized
          },
          include: [
            {
              model: StudentsInscription,
              required: true, //entrolled
              where: {
                is_admitted: true, //admitted
              },
              include: [
                {
                  model: Masters,
                  required: true,
                  where: {
                    type_diploma: diploma_type.type,
                  },
                },
              ],
            },
          ],
        });

        // Adding introductory information

        const studentCount = admittedStudents.length;
        const studentCountRow = worksheet.getRow(1);
        studentCountRow.getCell(1).value = "Nombre d'etudiants";
        studentCountRow.getCell(2).value = studentCount;

        const inscritsStudents = admittedStudents.filter((st) => {
          return st.StudentsInscriptions?.length;
        });

        const studentRows = [];
        for (const student of inscritsStudents) {
          if (student.StudentsInscriptions?.length) {
            for (const ins of student.StudentsInscriptions) {
              //will travel
              /*
                  "Student
                  "Type
                  "Average
                  "Email
                  Branch
                  "Year
                  "Department
                  Pays
                  University
                  "Parcours
                  "Scholarship
                  */

              studentRows.push([
                student.name + " " + student.family_name,
                mastersMap.get(ins.master_id)!.type_diploma,
                student.average,
                student.email,
                `ULFG ${"I".repeat(student.branch)}`,
                student.annee,
                `Genie ${
                  student.departement === "GE"
                    ? "Electrique"
                    : student.departement === "GM"
                    ? "Mecanique"
                    : student.departement === "GC"
                    ? "Civile"
                    : "Petro"
                }`,
                unisersityMap.get(ins.university_id)!.country,
                unisersityMap.get(ins.university_id)!.university_name,
                mastersMap.get(ins.master_id)!.name,
                mastersMap.get(ins.master_id)!.Scholarship?.name || "None",
              ]);
            }
          }
        }

        // Define columns in the worksheet
        let columns = [
          { name: "Student Name", filterButton: false },
          { name: "Type ", filterButton: false },
          { name: "Average", filterButton: false },
          { name: "Email", filterButton: false },
          {
            name: "Branch",
            filterButton: false,
          },
          {
            name: "Year",
            filterButton: false,
          },
          {
            name: "Department",
            filterButton: false,
          },
          {
            name: "Pays",
            filterButton: false,
          },
          {
            name: "University",
            filterButton: false,
          },
          {
            name: "Parcours",
            filterButton: false,
          },
          {
            name: "Scholarship",

            filterButton: false,
          },
        ];

        if (studentRows.length) {
          worksheet.addTable({
            name: `Diplome${diploma_type.type}`,
            ref: `A5`,
            headerRow: true,
            totalsRow: false,

            columns,
            rows: studentRows,
            style: { showRowStripes: true },
          });
        } else {
          const studentCountRow = worksheet.getRow(5);
          studentCountRow.getCell(1).value = "No students";
        }
      }
      return workbook;
    } catch (error) {
      console.log(error);
      return workbook;
    }
  }
  // BULK ADD FROM EXCEL
  async importFromExcel(workbook: ExcelJS.Workbook) {
    try {
      const worksheet = workbook.getWorksheet(1); // Get the first worksheet
      if (!worksheet) throw "Empty Workbook";
      const toCreatNumeroDuDossier = new Map<
        number,
        {
          student: any;
          inscriptions: any[];
        }
      >();
      const promises: Promise<boolean>[] = [];
      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber > 1) {
          promises.push(
            new Promise<boolean>((resolve, reject) => {
              try {
                // Assuming the first row is headers
                // Extract data from each row to create a Master entry
                //Student
                const name = row.getCell(1).value;
                const family_name = row.getCell(2).value;
                const type_diploma = row.getCell(3).value;
                const email = row.getCell(4).value;
                const phone = row.getCell(5).value;

                const nbr_dossier = Number(row.getCell(6).value);
                const departement = row.getCell(7).value;
                const annee = Number(row.getCell(8).value);
                const branch = row.getCell(9).value;
                const notes_sem_1 = row.getCell(10).value;
                const notes_sem_2 = row.getCell(11).value;
                const notes_sem_3 = row.getCell(12).value;
                const notes_sem_4 = row.getCell(13).value;
                const notes_sem_5 = row.getCell(14).value;
                const notes_sem_6 = row.getCell(15).value;
                const notes_sem_7 = row.getCell(16).value;
                const notes_sem_8 = row.getCell(17).value;
                const notes_sem_9 = row.getCell(18).value;
                const notes_sem_10 = row.getCell(19).value;

                const average = row.getCell(20).value;

                //inscription
                const eligible = Number(average) > 75;
                const date = new Date();
                date.setFullYear(2024 + 5 - Number(annee));
                date.setMonth(5);
                date.setDate(25);

                const is_admitted = false;
                const is_confirmed = false;
                const has_scholarship = false;
                const expected_grad_date = date;
                const university_id = Number(row.getCell(21).value);
                const master_id = Number(row.getCell(22).value);
                const comment = row.getCell(23).value;

                if (!toCreatNumeroDuDossier.has(Number(nbr_dossier))) {
                  const notes = [
                    notes_sem_1,
                    notes_sem_2,
                    notes_sem_3,
                    notes_sem_4,
                    notes_sem_5,
                    notes_sem_6,
                    notes_sem_7,
                    notes_sem_8,
                    notes_sem_9,
                    notes_sem_10,
                  ]
                    .map((grade, index) => {
                      if (
                        (annee < 4 && index + 1 >= 7) ||
                        (annee < 5 && index + 1 >= 9)
                      )
                        return null;
                      return {
                        [`sem${index + 1}`]: grade,
                      };
                    })
                    .filter((x) => x);

                  toCreatNumeroDuDossier.set(Number(nbr_dossier), {
                    student: {
                      name,
                      notes,
                      nbr_dossier,
                      family_name,
                      phone,
                      email,
                      departement,
                      annee,
                      branch,
                      average,
                      eligible,
                      expected_grad_date: new Date(expected_grad_date),
                      comment,
                    },
                    inscriptions: [],
                  });
                }
                //  CREATE INSCRIPTIONS

                toCreatNumeroDuDossier
                  .get(Number(nbr_dossier))!
                  .inscriptions.push({
                    student_id: toCreatNumeroDuDossier.get(Number(nbr_dossier))!
                      .student.id,
                    master_id,
                    university_id,
                    is_admitted,
                    is_confirmed,
                    has_scholarship,
                    motivation_letter_file: null,
                    recommendation_letter_file: null,
                    cv_file: null,
                    admission_letter_file: null,
                    nomination_letter_file: null,
                  });
                // console.table({
                //   name,
                //   family_name,
                //   type_diploma,
                //   email,
                //   phone,
                //   nbr_dossier,
                //   departement,
                //   annee,
                //   branch,
                //   notes_sem_1,
                //   notes_sem_2,
                //   notes_sem_3,
                //   notes_sem_4,
                //   notes_sem_5,
                //   notes_sem_6,
                //   notes_sem_7,
                //   notes_sem_8,
                //   notes_sem_9,
                //   notes_sem_10,
                //   average,
                //   university_id,
                //   master_id,
                //   comment,
                // });
                resolve(true);
              } catch (error) {
                console.log(error);
                resolve(false);
              }
            })
          );
        }
      });
      for (const promise of promises) {
        const x = await promise;
      }
      for (const [nbr_dossier, student] of toCreatNumeroDuDossier.entries()) {
        try {
          const studentDetail = await Students.create(student.student);
          toCreatNumeroDuDossier.get(nbr_dossier)!.student =
            studentDetail.toJSON();
        } catch (error) {}
      }
      for (const [nbr_dossier, student] of toCreatNumeroDuDossier.entries()) {
        try {
          student.inscriptions.forEach(
            (ins) => (ins.student_id = student.student.id)
          );
          await StudentsInscription.bulkCreate(student.inscriptions);
        } catch (error) {}
      }
    } catch (error) {
      throw error;
    }
  }
}
export const student_inscriptionController =
  new StudentsInscriptionController();
