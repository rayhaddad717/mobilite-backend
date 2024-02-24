import express from "express";
import database from "./db";
import University from "./models/UniversityModel";
//import Bourse from "./models/BourseModel";
import bodyParser from "body-parser";
import universityRoutes from "./routes/UniversityRoutes";
import scholarshipRoutes from "./routes/ScholarshipRoutes";
import mastersRoutes from "./routes/MasterRoutes";
import studentsinscriptionRoutes from "./routes/StudentsInscriptionRoutes";
import morgan from "morgan";
import cors from "cors";
import Department from "./models/DepartmentModel";
import Scholarship from "./models/ScholarshipModel";
import Masters from "./models/MastersModel";
import StudentsInscription from "./models/StudentsInscriptionModel";

const app = express();
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
// Middleware to log HTTP requests
app.use(morgan("tiny"));

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded form bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Use the route files
app.use("/api/scholarship", scholarshipRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/masters", mastersRoutes);
app.use("/api/studentinscription",studentsinscriptionRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use("/api/bourse",)

class BootStrap {
  constructor() {}
  async init() {
    try {
      await database.sync({ alter: true });
      await database.authenticate();
      await this.addTableRelations();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  async addTableRelations() {
    await University.sync({ alter: true });
    await Scholarship.sync({ alter: true });
    Masters.belongsTo(University, { foreignKey: "university_id" });
    Masters.belongsTo(Scholarship, { foreignKey: "id_bourse" });
    await Masters.sync({ alter: true });
  }
}
new BootStrap().init();
