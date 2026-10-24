const db = require("../config/db");

const mapAdmission = (row) => ({
  _id: row.id,

  studentName: row.student_name,
  parentName: row.parent_name,
  contactNumber: row.contact_number,
  grade: row.grade,
  previousSchool: row.previous_school,
  message: row.message,

  status: row.status,

  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// GET /api/admission
exports.getAdmissions = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM admissions ORDER BY created_at DESC",
    );

    const admissions = rows.map(mapAdmission);

    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error("Get Admissions Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/admission
exports.submitAdmission = async (req, res) => {
  try {
    const {
      studentName,
      parentName,
      contactNumber,
      grade,
      previousSchool,
      message,
    } = req.body;

    if (!studentName || !parentName || !contactNumber || !grade) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO admissions
      (
        student_name,
        parent_name,
        contact_number,
        grade,
        previous_school,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        studentName,
        parentName,
        contactNumber,
        grade,
        previousSchool || null,
        message || null,
      ],
    );

    const [rows] = await db.execute("SELECT * FROM admissions WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      data: mapAdmission(rows[0]),
    });
  } catch (error) {
    console.error("Submit Admission Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admission/:id
exports.deleteAdmission = async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM admissions WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admission form removed successfully",
    });
  } catch (error) {
    console.error("Delete Admission Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
