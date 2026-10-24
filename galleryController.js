const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const mapGallery = (row) => ({
  _id: row.id,
  imageUrl: row.image_url,
  publicId: row.public_id,
  category: row.category,
  title: row.title,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

exports.getGalleryByCategory = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM gallery WHERE category=? ORDER BY created_at DESC",
      [req.params.category],
    );
    res
      .status(200)
      .json({ success: true, count: rows.length, data: rows.map(mapGallery) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { category, title } = req.body;
    if (!req.file || !category)
      return res
        .status(400)
        .json({ success: false, message: "Image and category are required" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const [r] = await db.execute(
      "INSERT INTO gallery (image_url, public_id, category, title) VALUES (?,?,?,?)",
      [imageUrl, req.file.filename, category, title || null],
    );
    const [rows] = await db.execute("SELECT * FROM gallery WHERE id=?", [
      r.insertId,
    ]);
    res.status(201).json({ success: true, data: mapGallery(rows[0]) });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM gallery WHERE id=?", [
      req.params.id,
    ]);
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    const image = rows[0];
    const filePath = path.join(__dirname, "..", "uploads", image.public_id);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await db.execute("DELETE FROM gallery WHERE id=?", [req.params.id]);
    res
      .status(200)
      .json({ success: true, message: "Image removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
