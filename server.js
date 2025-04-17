const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server
const config = {
  user: "sa",
  password: "D@ihocfpt2025",
  server: "TuanIT\\MAPDEVICE",
  database: "WifiBeta",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Kết nối SQL Server
sql.connect(config)
  .then(() => console.log("✅ Kết nối SQL Server thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối SQL Server:", err));

// ✅ GET - Lấy danh sách WiFi tầng 1 Beta
app.get("/api/tang1beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 3 Beta
app.get("/api/tang3beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang3beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 1 Beta
app.post("/api/tang1beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang1Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ POST - Thêm WiFi mới tầng 3 Beta
app.post("/api/tang3beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang3Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});


// ✅ GET - Lấy danh sách WiFi tầng 3 Beta
app.get("/api/tang3beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang3beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});


// ✅ POST - Thêm WiFi mới tầng 3 Beta
app.post("/api/tang3beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang3Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});


// ✅ PUT - Cập nhật WiFi tầng 1 Beta (Tên + vị trí)
app.put("/api/tang1beta/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang1beta
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});


// ✅ PUT - Cập nhật WiFi tầng 3 Beta (Tên + vị trí)
app.put("/api/tang3beta/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang3beta
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 1 Beta
app.delete("/api/tang1beta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang1Beta WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 2 Beta
app.get("/api/tang2beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 2 Beta
app.post("/api/tang2beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang2Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 2 Beta(Tên + vị trí)
app.put("/api/tang2beta/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang2beta
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 2 Beta
app.delete("/api/tang2beta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang2Beta WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});
//Chức năng xóa wifi tầng 3 Beta
app.delete("/api/tang3beta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang3Beta WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 4 Beta
app.get("/api/tang4beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 4 Beta
app.post("/api/tang4beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang4Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 4 Beta (Tên + vị trí)
app.put("/api/tang4beta/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang4beta
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 4 Beta
app.delete("/api/tang4beta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang4Beta WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 5 Beta
app.get("/api/tang5beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang5beta");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 5 Beta
app.post("/api/tang5beta", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang5Beta (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 5 Beta (Tên + vị trí)
app.put("/api/tang5beta/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang5beta
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 5 Beta
app.delete("/api/tang5beta/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang5Beta WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 1 Gamma
app.get("/api/tang1gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 1 Gamma
app.post("/api/tang1gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang1Gamma (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 1 Gamma (Tên + vị trí)
app.put("/api/tang1gamma/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang1gamma
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 1 Gamma
app.delete("/api/tang1gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang1Gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 2 Gamma
app.get("/api/tang2gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 2 Gamma
app.post("/api/tang2gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang2Gamma (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 2 Gamma (Tên + vị trí)
app.put("/api/tang2gamma/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang2gamma
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 2 Gamma
app.delete("/api/tang2gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang2Gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 3 Gamma
app.get("/api/tang3gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang3gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 3 Gamma
app.post("/api/tang3gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang3Gamma (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 3 Gamma (Tên + vị trí)
app.put("/api/tang3gamma/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang3gamma
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 3 Gamma
app.delete("/api/tang3gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang3Gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 1 nhà CV số 5
app.get("/api/tang1ncvso5", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso5");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới tầng 1 NCV số 5
app.post("/api/tang1ncvso5", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang1ncvso5 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});
// ✅ PUT - Cập nhật WiFi tầng 1 nhà CV số 5 (Tên + vị trí)
app.put("/api/tang1ncvso5/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang1ncvso5
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 1 Nhà CV số 5
app.delete("/api/tang1ncvso5/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang1ncvso5 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 2 nhà CV số 5
app.get("/api/tang2ncvso5", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Tang2NCVso5");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới tầng 2 NCV số 5
app.post("/api/tang2ncvso5", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO Tang2NCVso5 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});
// ✅ PUT - Cập nhật WiFi tầng 2 nhà CV số 5 (Tên + vị trí)
app.put("/api/tang2ncvso5/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang2ncvso5
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 2 Nhà CV số 5
app.delete("/api/tang2ncvso5/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM Tang2NCVso5 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 1 Nhà công vụ số 6
app.get("/api/tang1ncvso6", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso6");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 1 Nhà công vụ số 6
app.post("/api/tang1ncvso6", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang1ncvso6 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 1 Nhà công vụ số 6(Tên + vị trí)
app.put("/api/tang1ncvso6/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang1ncvso6
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 1 Nhà công vụ số 6
app.delete("/api/tang1ncvso6/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang1ncvso6 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 2 Nhà công vụ số 6
app.get("/api/tang2ncvso6", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2ncvso6");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 2 Nhà công vụ số 6
app.post("/api/tang2ncvso6", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang2ncvso6 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 2 Nhà công vụ số 6(Tên + vị trí)
app.put("/api/tang2ncvso6/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang2ncvso6
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 2 Nhà công vụ số 6
app.delete("/api/tang2ncvso6/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang2ncvso6 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 1 Nhà công vụ số 7
app.get("/api/tang1ncvso7", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso7");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 1 Nhà công vụ số 7
app.post("/api/tang1ncvso7", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang1ncvso7 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 1 Nhà công vụ số 7(Tên + vị trí)
app.put("/api/tang1ncvso7/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang1ncvso7
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 1 Nhà công vụ số 7
app.delete("/api/tang1ncvso7/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang1ncvso7 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi tầng 2 Nhà công vụ số 7
app.get("/api/tang2ncvso7", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2ncvso7");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới tầng 2 Nhà công vụ số 7
app.post("/api/tang2ncvso7", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang2ncvso7 (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi tầng 2 Nhà công vụ số 7(Tên + vị trí)
app.put("/api/tang2ncvso7/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE tang2ncvso7
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi tầng 2 Nhà công vụ số 7
app.delete("/api/tang2ncvso7/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang2ncvso7 WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi KTX Dom B
app.get("/api/ktxdomb", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM ktxdomb");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới KTX Dom B
app.post("/api/ktxdomb", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO ktxdomb (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi KTX Dom B(Tên + vị trí)
app.put("/api/ktxdomb/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE ktxdomb
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi KTX Dom B
app.delete("/api/ktxdomb/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM ktxdomb WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi KTX Dom A
app.get("/api/ktxdoma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM ktxdoma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ POST - Thêm WiFi mới KTX Dom A
app.post("/api/ktxdoma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO ktxdoma (Name, TopPosition, LeftPosition)
        OUTPUT INSERTED.*
        VALUES (@name, @topPosition, @leftPosition)
      `);

    const insertedWifi = result.recordset[0];

    res.status(201).json({ message: "✅ Thêm WiFi thành công", wifi: insertedWifi });
  } catch (err) {
    console.error("❌ Lỗi thêm WiFi:", err);
    res.status(500).json({ error: "Lỗi khi thêm WiFi vào cơ sở dữ liệu" });
  }
});

// ✅ PUT - Cập nhật WiFi KTX Dom A(Tên + vị trí)
app.put("/api/ktxdoma/:id", async (req, res) => {
  const { id } = req.params;
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("id", sql.Int, parseInt(id))
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        UPDATE ktxdoma
        SET 
          name = @name,
          topPosition = @topPosition,
          leftPosition = @leftPosition
        WHERE id = @id
      `);

    res.send("✅ Đã cập nhật WiFi (tên + vị trí) thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật WiFi:", error);
    res.status(500).json({ error: "Lỗi cập nhật WiFi", details: error.message });
  }
});

//Chức năng xóa wifi KTX Dom A
app.delete("/api/ktxdoma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM ktxdoma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ POST - Xử lý đăng nhập
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const request = new sql.Request();
    const result = await request
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Tài khoản không tồn tại" });
    }

    const user = result.recordset[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Mật khẩu không chính xác" });
    }

    res.json({ 
      message: "Đăng nhập thành công",
      user: { 
        username: user.username,
        role: user.role 
      }
    });

  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ✅ POST - Tạo tài khoản (Admin)
app.post("/api/users", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const request = new sql.Request();
    await request
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, password)
      .input("role", sql.NVarChar, role || "user")
      .query(`
        INSERT INTO Users (username, password, role)
        VALUES (@username, @password, @role)
      `);

    res.status(201).json({ message: "✅ Tạo tài khoản thành công" });
  } catch (error) {
    console.error("❌ Lỗi tạo tài khoản:", error);
    res.status(500).json({ error: "Tên đăng nhập đã tồn tại" });
  }
});
// ✅ Các tầng còn lại Beta
app.get("/api/tang2beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2beta");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang3beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang3beta");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang4beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4beta");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang5beta", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang5beta");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ Các tầng Gamma
app.get("/api/tang1gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1gamma");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang2gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2gamma");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang3gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang3gamma");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang4gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4gamma");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang5gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang5gamma");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

// ✅ Các tầng Nhà công vụ
app.get("/api/tang1ncvso5", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso5");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang2ncvso5", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2ncvso5");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang1ncvso6", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso6");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang2ncvso6", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2ncvso6");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
  
});

app.get("/api/tang1ncvso7", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang1ncvso7");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});

app.get("/api/tang2ncvso7", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang2ncvso7");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
  
});

// ✅ Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
