const bcrypt = require("bcryptjs");
const db = require("./config/db");

const createAdmin = async () => {
  try {
    const email = "principal@vidyabharatischoolkaranja.com";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO admins (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
