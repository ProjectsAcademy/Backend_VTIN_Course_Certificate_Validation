const { MongoClient } = require("mongodb");
const Student = require("../db/models/studentInfo");

// const dbName = "vtinCertificates";
const uri = process.env.MONGODB_URI;
// const uri = "mongodb://0.0.0.0:27017";
const dbName = "stuDataDb";
const collectionName = "studentInfo"; // Define the collection name here

// Create a MongoClient with connection pooling
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
  maxPoolSize: 10, // Set the size of the connection pool
});

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
}

async function testDatabaseConnection() {
  try {
    await client.connect();
    await client.db(dbName).command({ serverStatus: 1 });
    console.log("Database connection successful");
    return "Database connection successful";
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  } finally {
    await client.close();
  }
}

async function closeDB() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB connection", err);
  }
}

function getStuInfoCollection() {
  const db = client.db(dbName);
  return db.collection("studentInfo");
}

async function saveStudentData(data) {
  try {
    // Connect to the database
    const db = await connectToDB();

    if (db) {
      try {
        // Get the student collection
        const studentCollection = getStuInfoCollection();

        // Create a new student instance using the provided data
        const student = new Student(data);

        // Save the student data to the database
        const savedStudent = await studentCollection.insertOne(student);

        console.log("Student data saved successfully:", savedStudent);

        return savedStudent; // Return the saved student data if needed
      } catch (error) {
        console.error("Error saving student data:", error);
        throw error;
      } finally {
        // Close the database connection
        await closeDB();
      }
    } else {
      console.log("Unable to connect to the database.");
    }
  } catch (error) {
    console.error("Error during database connection:", error);
    throw error;
  }
}

async function getStudentDataById(studentId) {
  try {
    const collection = getStuInfoCollection();
    const studentData = await collection.findOne({ stu_id: studentId });
    return studentData;
  } catch (error) {
    console.error("Error fetching student data by ID:", error);
    throw error;
  }
}

module.exports = {
  testDatabaseConnection,
  saveStudentData,
  getStudentDataById,
};
