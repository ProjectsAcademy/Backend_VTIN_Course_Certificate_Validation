import express, { Router } from "express";
import serverless from "serverless-http";
import { saveStudentData } from "../utils/db";
import { getStudentDataById } from "../utils/db";

const corsMiddleware = require("../middleware/corsMiddleware");

const api = express();
const router = Router();

// // Apply the CORS middleware globally
api.use(corsMiddleware);

router.use(express.json()); // Adding express.json() middleware here

router.get("/", (req, res) =>
  res.send("Hello from studentData function / route")
);

// Define a route to save student data
router.post("/saveStudentData", async (req, res) => {
  try {
    const { stu_id, studentName, courseName, completionDate, certificateLink } =
      req.body;

    console.log("data recieved");
    console.log(
      stu_id,
      studentName,
      courseName,
      completionDate,
      certificateLink
    );

    // Ensure all required fields are provided
    if (
      !stu_id ||
      !studentName ||
      !courseName ||
      !completionDate ||
      !certificateLink
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare the data object
    const studentData = {
      stu_id,
      studentName,
      courseName,
      completionDate,
      certificateLink,
    };

    // Save the student data to the database
    await saveStudentData(studentData);
    res.json({ message: "Student data saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving student data", details: error.message });
  }
});

router.get("/accomplishments/verify/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Fetch student data by ID from the database
    const studentData = await getStudentDataById(studentId);

    if (!studentData) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ studentData });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching student data", details: error.message });
  }
});

// router.post("/saveTest", async (req, res) => {
//   console.log("data recieved")
//   res.send(req.body)
// });

api.use("/studentData/", router);

export const handler = serverless(api);
