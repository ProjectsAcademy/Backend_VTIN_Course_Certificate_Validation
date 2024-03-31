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
function getStuInfoCollection() {
  const db = client.db(dbName);
  return db.collection("studentInfo");
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

// function getStuInfoCollection() {
//   const db = client.db(dbName);
//   return db.collection("studentInfo");
// }

// async function testDatabaseConnection() {
//   try {
//     const db = await connectToDB();

//     if (db) {
//       try {
//         const StuInfoCollection = getStuInfoCollection();

//         const randomDocument = await StuInfoCollection.aggregate([
//           { $sample: { size: 1 } },
//         ]).toArray();
//         console.log(randomDocument);
//         if (randomDocument.length > 0) {
//           console.log("Database collection connection Succesfull");
//           return randomDocument;
//         } else {
//           console.log("Error during database's collection connection::");
//         }
//       } catch (error) {
//         console.error("Error during database's collection connection:", error);
//       } finally {
//         // Close the database connection
//         await closeDB();
//       }
//     } else {
//       console.log("Unable to connect to the database.");
//     }
//   } catch (error) {
//     console.error("Error during database connection:", error);
//   }
// }

// async function saveStudentData(data) {
//   try {
//     console.log("saveStudentData func get called")
//     console.log("Data from saveStudenData func : " , data)
//     // Create a new student instance using the provided data
//     const student = new Student(data);
//     console.log("student schema called" , student)
//     // Save the student data to the database
//     const savedStudent = await student.save();
//     console.log("Student data saved successfully:", savedStudent);
//     return savedStudent; // Return the saved student data if needed
//   } catch (error) {
//     console.error("Error saving student data:", error);
//     throw error;
//   }
// }

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

module.exports = {
  testDatabaseConnection,
  saveStudentData,
};
