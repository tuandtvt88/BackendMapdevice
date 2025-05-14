const sql = require("mssql");
const cors = require("cors");
const ping = require('ping');
const WebSocket = require('ws');
const schedule = require('node-schedule');
const dns = require('dns');

const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
require('dotenv').config({ path: './sql.env' });


// Cấu hình kết nối đến Azure SQL
const config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DB,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Initialize WebSocket server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${server.address().port}`);
});

const wss = new WebSocket.Server({ server });

let sqlConnectionPool;

async function connectToDatabase() {
  try {
    if (sqlConnectionPool && sqlConnectionPool.connected) {
      return sqlConnectionPool;
    }
    
    sqlConnectionPool = await sql.connect(config);
    console.log("✅ Kết nối SQL Server thành công!");
    
    sqlConnectionPool.on('error', err => {
      console.error('❌ Lỗi kết nối SQL:', err);
      setTimeout(connectToDatabase, 5000);
    });
    
    return sqlConnectionPool;
  } catch (err) {
    console.error("❌ Lỗi kết nối SQL Server:", err);
    setTimeout(connectToDatabase, 5000);
    throw err;
  }
}

// Gọi hàm kết nối khi khởi động
connectToDatabase();

// Đối tượng lưu trữ thông tin thiết bị WiFi
const wifiDevices = [
{ name: "AP-KTX Dom A-ACP", ip: "10.10.0.81" },
{ name: "AP-KTX Dom B-ACP", ip: "10.10.0.79" },
{ name: "AP-VOVINAM", ip: "10.10.0.87" },
{ name: "AP-Tang-5-515-U6", ip: "10.10.0.83" },
{ name: "AP-BT-CTSV-U6", ip: "10.10.0.102" },
{ name: "AP-BT-FU-U6P", ip: "10.10.0.184" },
{ name: "AP-BT-IT-ACP", ip: "10.10.0.76" },
{ name: "AP-BT-Phong AI-U6", ip: "10.10.0.71" },
{ name: "AP-BT-Phong hop-ACP", ip: "10.10.0.52" },
{ name: "AP-BT-Sales-U6P", ip: "10.10.0.139" },
{ name: "AP-BT-SanTruong-01-U6", ip: "10.10.0.117" },
{ name: "AP-BT-SanTruong-02-U6P", ip: "10.10.0.91" },
{ name: "AP-BT-SanTruong-03-ACP", ip: "10.10.0.82" },
{ name: "AP-BT-Server-ACP", ip: "10.10.0.86" },
{ name: "AP-BT-Tang 4-401-U6", ip: "10.10.0.97" },
{ name: "AP-BT-Tang 4-404-U6", ip: "10.10.0.103" },
{ name: "AP-BT-Tang 5-506-U6", ip: "10.10.0.116" },
{ name: "AP-BT-Tang-2-201-U6P", ip: "10.10.0.100" },
{ name: "AP-BT-Tang-2-203-U6P", ip: "10.10.0.57" },
{ name: "AP-BT-Tang-2-204-U6P", ip: "10.10.0.107" },
{ name: "AP-BT-Tang-2-206-U6", ip: "10.10.0.58" },
{ name: "AP-BT-Tang-2-208-ACP", ip: "10.10.0.51" },
{ name: "AP-BT-Tang-2-209-ACP", ip: "10.10.0.65" },
{ name: "AP-BT-Tang-2-212-U6", ip: "10.10.0.98" },
{ name: "AP-BT-Tang-2-213-ACP", ip: "10.10.0.84" },
{ name: "AP-BT-Tang-2-214-U6P", ip: "10.10.0.60" },
{ name: "AP-BT-Tang-2-216-ACP", ip: "10.10.0.62" },
{ name: "AP-BT-Tang-2-217-U6P", ip: "10.10.0.104" },
{ name: "AP-BT-Tang-2-218-ACP", ip: "10.10.0.63" },
{ name: "AP-BT-Tang-2-220-U6", ip: "10.10.0.69" },
{ name: "AP-BT-Tang-2-222-U6", ip: "10.10.0.92" },
{ name: "AP-BT-Tang-2-224-U6P", ip: "10.10.0.61" },
{ name: "AP-BT-Tang-3-301-U6P", ip: "10.10.0.128" },
{ name: "AP-BT-Tang-3-303-U6P", ip: "10.10.0.129" },
{ name: "AP-BT-Tang-3-304-U6P", ip: "10.10.0.67" },
{ name: "AP-BT-Tang-3-305-U6P", ip: "10.10.0.73" },
{ name: "AP-BT-Tang-3-306-U6P", ip: "10.10.0.72" },
{ name: "AP-BT-Tang-3-308-U6P", ip: "10.10.0.80" },
{ name: "AP-BT-Tang-3-309-U6P", ip: "10.10.0.130" },
{ name: "AP-BT-Tang-3-311-U6P", ip: "10.10.0.85" },
{ name: "AP-BT-Tang-3-312-U6P", ip: "10.10.0.108" },
{ name: "AP-BT-Tang-3-313-U6P", ip: "10.10.0.131" },
{ name: "AP-BT-Tang-3-314-U6P", ip: "10.10.0.75" },
{ name: "AP-BT-Tang-3-316-U6P", ip: "10.10.0.133" },
{ name: "AP-BT-Tang-3-317-U6P", ip: "10.10.0.132" },
{ name: "AP-BT-Tang-3-320-U6", ip: "10.10.0.101" },
{ name: "AP-BT-Tang-3-322-U6", ip: "10.10.0.78" },
{ name: "AP-BT-Tang-3-323-U6P", ip: "10.10.0.190" },
{ name: "AP-BT-Tang-3-324-U6", ip: "10.10.0.191" },
{ name: "AP-BT-Tang-4-403-U6", ip: "10.10.0.119" },
{ name: "AP-BT-Tang-4-405-U6", ip: "10.10.0.110" },
{ name: "AP-BT-Tang-4-406-U6", ip: "10.10.0.125" },
{ name: "AP-BT-Tang-4-408-U6P", ip: "10.10.0.127" },
{ name: "AP-BT-Tang-4-409-U6P", ip: "10.10.0.123" },
{ name: "AP-BT-Tang-4-411-U6", ip: "10.10.0.122" },
{ name: "AP-BT-Tang-4-412-U6", ip: "10.10.0.111" },
{ name: "AP-BT-Tang-4-413-U6", ip: "10.10.0.53" },
{ name: "AP-BT-Tang-4-414-U6", ip: "10.10.0.126" },
{ name: "AP-BT-Tang-4-416-U6", ip: "10.10.0.105" },
{ name: "AP-BT-Tang-4-417-U6", ip: "10.10.0.94" },
{ name: "AP-BT-Tang-4-418-U6", ip: "10.10.0.118" },
{ name: "AP-BT-Tang-4-419-U6", ip: "10.10.0.112" },
{ name: "AP-BT-Tang-4-420-U6", ip: "10.10.0.74" },
{ name: "AP-BT-Tang-4-421-U6", ip: "10.10.0.124" },
{ name: "AP-BT-Tang-4-422-U6", ip: "10.10.0.113" },
{ name: "AP-BT-Tang-4-423-U6", ip: "10.10.0.114" },
{ name: "AP-BT-Tang-4-424-U6P", ip: "10.10.0.183" },
{ name: "AP-BT-Tang-5-503-U6", ip: "10.10.0.59" },
{ name: "AP-BT-Tang-5-505-ACP", ip: "10.10.0.55" },
{ name: "AP-BT-Tang-5-507-U6P", ip: "10.10.0.106" },
{ name: "AP-BT-Tang-5-509-U6", ip: "10.10.0.115" },
{ name: "AP-BT-Tang-5-510-U6", ip: "10.10.0.135" },
{ name: "AP-BT-Tang-5-511-U6", ip: "10.10.0.64" },
{ name: "AP-BT-Tang-5-512-U6P", ip: "10.10.0.183" },
{ name: "AP-BT-Tang-5-513-U6P", ip: "10.10.0.99" },
{ name: "AP-BT-Tang-5-H1-U6", ip: "10.10.0.121" },
{ name: "AP-BT-Tang-5-H2-U6", ip: "10.10.0.222" },
{ name: "AP-BT-Tang-5-H3-U6", ip: "10.10.0.120" },
{ name: "AP-BT-Tang-3-318-ACP", ip: "10.10.0.68" },
{ name: "AP-BT-Thu vien-01-ACP", ip: "10.10.0.54" },
{ name: "AP-BT-Thu vien-03-ACP", ip: "10.10.0.95" },
{ name: "AP-BT-Thuvien-02-ACP", ip: "10.10.0.134" },
{ name: "AP-GM-104-PhongHop-U6P", ip: "10.10.0.170" },
{ name: "AP-GM-PDichVu-U6P", ip: "10.10.0.141" },
{ name: "AP-GM-SanTruong-01-U6P", ip: "10.10.0.142" },
{ name: "AP-GM-SanTruong-02-U6P", ip: "10.10.0.143" },
{ name: "AP-GM-SanTruong-03-U6P", ip: "10.10.0.144" },
{ name: "AP-GM-Server-ACP", ip: "10.10.0.77" },
{ name: "AP-GM-Tang-2-201-U6P", ip: "10.10.0.148" },
{ name: "AP-GM-Tang-2-203-U6P", ip: "10.10.0.149" },
{ name: "AP-GM-Tang-2-204-ACP", ip: "10.10.0.158" },
{ name: "AP-GM-Tang-2-205-U6P", ip: "10.10.0.150" },
{ name: "AP-GM-Tang-2-208-ACP", ip: "10.10.0.162" },
{ name: "AP-GM-Tang-2-209-ACP", ip: "10.10.0.161" },
{ name: "AP-GM-Tang-2-213-U6P", ip: "10.10.0.159" },
{ name: "AP-GM-Tang-2-214-U6", ip: "10.10.0.175" },
{ name: "AP-GM-Tang-2-215-U6P", ip: "10.10.0.152" },
{ name: "AP-GM-Tang-2-217-U6P", ip: "10.10.0.153" },
{ name: "AP-GM-Tang-2-218-U6P", ip: "10.10.0.160" },
{ name: "AP-GM-Tang-2-219-U6P", ip: "10.10.0.154" },
{ name: "AP-GM-Tang-2-222-ACP", ip: "10.10.0.163" },
{ name: "AP-GM-Tang-2-223-U6P", ip: "10.10.0.155" },
{ name: "AP-GM-Tang-2-225-U6P", ip: "10.10.0.157" },
  { name: "AP-GM-Tang-2-226-U6P", ip: "10.10.0.156" },
  { name: "AP-GM-Tang-3-301-U6P", ip: "10.10.0.164" },
  { name: "AP-GM-Tang-3-303-U6P", ip: "10.10.0.165" },
  { name: "AP-GM-Tang-3-304-U6P", ip: "10.10.0.181" },
  { name: "AP-GM-Tang-3-305-U6P", ip: "10.10.0.169" },
  { name: "AP-GM-Tang-3-308-U6P", ip: "10.10.0.179" },
  { name: "AP-GM-Tang-3-309-ACP", ip: "10.10.0.180" },
  { name: "AP-GM-Tang-3-311-U6", ip: "10.10.0.174" },
  { name: "AP-GM-Tang-3-313-U6P", ip: "10.10.0.177" },
  { name: "AP-GM-Tang-3-314-U6P", ip: "10.10.0.168" },
  { name: "AP-GM-Tang-3-315-U6P", ip: "10.10.0.173" },
  { name: "AP-GM-Tang-3-317-U6P", ip: "10.10.0.171" },
  { name: "AP-GM-Tang-3-318-U6P", ip: "10.10.0.176" },
  { name: "AP-GM-Tang-3-319-U6P", ip: "10.10.0.172" },
  { name: "AP-GM-Tang-3-322-ACP", ip: "10.10.0.178" },
  { name: "AP-GM-Tang-3-323-U6P", ip: "10.10.0.167" },
  { name: "AP-GM-Tang-3-325-U6P", ip: "10.10.0.182" },
  { name: "AP-GM-Tang-3-326-U6P", ip: "10.10.0.166" },
  { name: "AP-GM-ThuVien-01-U6P", ip: "10.10.0.145" },
  { name: "AP-GM-ThuVien-03-U6P", ip: "10.10.0.146" },
  { name: "AP-GM-ThuVien-04-U6", ip: "10.10.0.147" },
  { name: "AP-GM-VPFSC-U6P", ip: "10.10.0.140" },
  { name: "AP-NCV -6-T2-ACP", ip: "10.10.0.89" },
  { name: "AP-NCV 7-T2-ACP", ip: "10.10.0.93" },
  { name: "AP-NCV-5-T1-ACP", ip: "10.10.0.90" }, 
  { name: "AP-NCV-5-T2-ACP", ip: "10.10.0.88" },
  { name: "AP-NCV-6-T1-Lite", ip: "10.10.0.56" },
  { name: "AP-NCV-7-T1-Lite", ip: "10.10.0.70" },
  { name: "Ban Xay Dung-ACP", ip: "10.10.0.96" }, 
];

// Broadcast function for WebSocket
function broadcastPingResult(result) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'PING_UPDATE',
        data: result
      }));
    }
  });
}
// Hàm kiểm tra ARP
function checkArp(ip) {
  try {
    const arpOutput = require('child_process').execSync(`arp -a ${ip}`).toString();
    return arpOutput.includes(ip);
  } catch (e) {
    return false;
  }
}
// Ping a single device
// const pingDevice = async (device) => {
//     const canPing = checkPingPermission();
  
//   if (!canPing) {
//     console.warn('⚠️ Không có quyền thực hiện ping, sử dụng fallback');
//     const status = {
//       name: device.name,
//       ip: device.ip,
//       status: 'unknown',
//       responseTime: 0,
//       timestamp: new Date().toISOString(),
//       error: 'No ping permission'
//     };
//     await savePingResult(status);
//     broadcastPingResult(status);
//     return status;
//   }
//   try {
//     // Thêm option để sử dụng hệ thống ping thay vì spawn
//     const res = await ping.promise.probe(device.ip, {
//       timeout: 2,
//       extra: ['-i', '2'],
//     });
    
//     const status = {
//       name: device.name,
//       ip: device.ip,
//       status: res.alive ? 'online' : 'offline',
//       responseTime: res.alive ? parseInt(res.avg) || 0 : 0,
//       timestamp: new Date().toISOString()
//     };

//     await savePingResult(status);
//     broadcastPingResult(status);
    
//     return status;
//   } catch (error) {
//     console.error(`Error pinging ${device.ip}:`, error);
    
//     // Thêm fallback khi ping không hoạt động
//     const status = {
//       name: device.name,
//       ip: device.ip,
//       status: 'unknown', // Thay vì 'offline'
//       responseTime: 0,
//       timestamp: new Date().toISOString(),
//       error: error.message
//     };
    
//     await savePingResult(status);
//     broadcastPingResult(status);
//     return status;
//   }
// };



// Thêm hàm kiểm tra quyền ping
function checkPingPermission() {
  try {
    require('child_process').execSync('ping -c 1 127.0.0.1');
    return true;
  } catch {
    return false;
  }
}

// Sửa lại hàm pingDevice
const pingDevice = async (device) => {
  const canPing = checkPingPermission();
  
  if (!canPing) {
    console.warn('⚠️ Không có quyền thực hiện ping, sử dụng fallback');
    const status = {
      name: device.name,
      ip: device.ip,
      status: 'unknown',
      responseTime: 0,
      timestamp: new Date().toISOString(),
      error: 'No ping permission'
    };
    await savePingResult(status);
    broadcastPingResult(status);
    return status;
  }
  
  try {
    // Sử dụng ping hệ thống thay vì spawn
    const res = await ping.promise.probe(device.ip, {
      timeout: 2,
      extra: ['-i', '2'],
    });
    
    const status = {
      name: device.name,
      ip: device.ip,
      status: res.alive ? 'online' : 'offline',
      responseTime: res.alive ? parseInt(res.avg) || 0 : 0,
      timestamp: new Date().toISOString()
    };

    await savePingResult(status);
    broadcastPingResult(status);
    
    return status;
  } catch (error) {
    console.error(`Error pinging ${device.ip}:`, error);
    
    const status = {
      name: device.name,
      ip: device.ip,
      status: 'unknown',
      responseTime: 0,
      timestamp: new Date().toISOString(),
      error: error.message
    };
    
    await savePingResult(status);
    broadcastPingResult(status);
    return status;
  }
};



// Hàm lưu kết quả ping vào database
async function savePingResult(result) {
  try {
    const pool = await connectToDatabase();
    const request = new sql.Request(pool);
    await request
      .input('device_name', sql.NVarChar, result.name)
      .input('ip_address', sql.NVarChar, result.ip)
      .input('status', sql.NVarChar, result.status)
      .input('response_time', sql.Int, result.responseTime)
      .input('checked_at', sql.DateTime, new Date(result.timestamp))
      .query(`
        INSERT INTO WifiDeviceStatus (device_name, ip_address, status, response_time, checked_at)
        VALUES (@device_name, @ip_address, @status, @response_time, @checked_at)
      `);
  } catch (error) {
    console.error('Lỗi khi lưu kết quả ping:', error);
  }
}
// API để ping tất cả thiết bị
app.get('/api/ping-all-devices', async (req, res) => {
  try {
    console.log('Bắt đầu ping các thiết bị...');
    const pingResults = [];
    
    for (const device of wifiDevices) {
      try {
        const result = await pingDevice(device);
        pingResults.push(result);
        console.log(`Đã ping ${device.name} (${device.ip}): ${result.status}`);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Lỗi khi xử lý thiết bị ${device.name}:`, error);
        pingResults.push({
          name: device.name,
          ip: device.ip,
          status: 'offline',
          responseTime: 0,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    res.json({
      success: true,
      data: pingResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Lỗi khi ping thiết bị:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ping failed',
      details: error.message 
    });
  }
});

// API to get current device statuses
app.get("/api/device-status", async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const request = new sql.Request(pool);
    const result = await request.query(`
      SELECT device_name, ip_address, status, response_time, checked_at
      FROM WifiDeviceStatus
      WHERE checked_at = (
        SELECT MAX(checked_at) 
        FROM WifiDeviceStatus
      )
      ORDER BY device_name
    `);
    
    res.json(result.recordset);
  } catch (error) {
    console.error("Error getting device status:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// API to ping single device (proxy for frontend)
app.post("/api/ping", async (req, res) => {
  const { ip } = req.body;
  
  if (!ip) {
    return res.status(400).json({ error: "IP is required" });
  }

  try {
    const device = wifiDevices.find(d => d.ip === ip) || { name: ip, ip };
    const result = await pingDevice(device);
    
    res.json(result);
  } catch (error) {
    console.error(`Error pinging ${ip}:`, error);
    res.status(500).json({ 
      error: "Ping failed",
      details: error.message 
    });
  }
});

// Schedule regular pings every minute
const pingJob = schedule.scheduleJob('* * * * *', async () => {
  console.log('🔄 Scheduled ping job started at', new Date().toISOString());
  try {
    for (const device of wifiDevices) {
      await pingDevice(device);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('✅ Scheduled ping job completed');
  } catch (error) {
    console.error('Error in scheduled ping job:', error);
  }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Keep all your existing API endpoints (tang1beta, tang2beta, etc.)
// ... (keep all your existing floor APIs)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  pingJob.cancel();
  sqlConnectionPool?.close();
  server.close(() => {
    process.exit(0);
  });
});

// Thêm endpoint tìm kiếm WiFi locations
app.get("/api/wifi-locations", async (req, res) => {
  const { search } = req.query;
  
  try {
    // Luôn trả về JSON
    res.setHeader('Content-Type', 'application/json');
    
    const request = new sql.Request();
    const query = `
      SELECT 'Beta - Tầng 1' as location, Name as name, '/tang1beta' as path FROM Tang1Beta WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Beta - Tầng 2', Name, '/tang2beta' FROM Tang2Beta WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Beta - Tầng 3', Name, '/tang3beta' FROM Tang3Beta WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Beta - Tầng 4', Name, '/tang4beta' FROM Tang4Beta WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Beta - Tầng 5', Name, '/tang5beta' FROM Tang5Beta WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Gamma - Tầng 1', Name, '/tang1gamma' FROM Tang1Gamma WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Gamma - Tầng 2', Name, '/tang2gamma' FROM Tang2Gamma WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Gamma - Tầng 3', Name, '/tang3gamma' FROM Tang3Gamma WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Gamma - Tầng 4', Name, '/tang4gamma' FROM Tang4Gamma WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Gamma - Tầng 5', Name, '/tang5gamma' FROM Tang5Gamma WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 5 - Tầng 1', Name, '/tang1ncvso5' FROM Tang1NCVso5 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 5 - Tầng 2', Name, '/tang2ncvso5' FROM Tang2NCVso5 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 6 - Tầng 1', Name, '/tang1ncvso6' FROM Tang1NCVso6 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 6 - Tầng 2', Name, '/tang2ncvso6' FROM Tang2NCVso6 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 7 - Tầng 1', Name, '/tang1ncvso7' FROM Tang1NCVso7 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Nhà CV số 7 - Tầng 2', Name, '/tang2ncvso7' FROM Tang2NCVso7 WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'KTX Dom A', Name, '/ktxdoma' FROM KTXDomA WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'KTX Dom B', Name, '/ktxdomb' FROM KTXDomB WHERE Name LIKE '%'+@search+'%'
      UNION ALL SELECT 'Sân Vovinam', Name, '/vovinam' FROM Vovinam WHERE Name LIKE '%'+@search+'%'
      ORDER BY name
    `;
    
    const result = await request
      .input('search', sql.NVarChar, search || '')
      .query(query);
    
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm WiFi locations:", error);
    // Luôn trả về JSON kể cả khi lỗi
    res.status(500).json({ 
      error: "Lỗi truy vấn SQL Server",
      details: error.message 
    });
  }
});

// API để ping tất cả thiết bị
app.get('/api/ping-all-devices', async (req, res) => {
  try {
    console.log('Bắt đầu ping các thiết bị...');
    
    // Ping từng thiết bị tuần tự để tránh quá tải
    const pingResults = [];
    for (const device of wifiDevices) {
      try {
        const result = await pingDevice(device);
        pingResults.push(result);
        await savePingResult(result);
        console.log(`Đã ping ${device.name} (${device.ip}): ${result.status}`);
      } catch (error) {
        console.error(`Lỗi khi xử lý thiết bị ${device.name}:`, error);
        pingResults.push({
          name: device.name,
          ip: device.ip,
          status: 'offline',
          responseTime: 0
        });
      }
      // Thêm delay 100ms giữa các lần ping
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    res.json({
      success: true,
      data: pingResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Lỗi khi ping thiết bị:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ping failed',
      details: error.message 
    });
  }
});
// Hàm lưu kết quả ping vào database
async function savePingResult(result) {
  try {
    if (!sqlConnectionPool || !sqlConnectionPool.connected) {
      await connectToDatabase();
    }
    
    const request = new sql.Request();
    await request
      .input('device_name', sql.NVarChar, result.name)
      .input('ip_address', sql.NVarChar, result.ip)
      .input('status', sql.NVarChar, result.status)
      .input('response_time', sql.Int, result.responseTime)
      .input('checked_at', sql.DateTime, new Date(result.timestamp))
      .query(`
        INSERT INTO WifiDeviceStatus (device_name, ip_address, status, response_time, checked_at)
        VALUES (@device_name, @ip_address, @status, @response_time, @checked_at)
      `);
  } catch (error) {
    console.error('Lỗi khi lưu kết quả ping:', error);
  }
}

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

// ✅ GET - Lấy danh sách WiFi Tầng 4 Gamma
app.get("/api/tang4gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới Tầng 4 Gamma
app.post("/api/tang4gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang4gamma (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi Tầng 4 Gamma (Tên + vị trí)
app.put("/api/tang4gamma/:id", async (req, res) => {
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
        UPDATE tang4gamma
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

//Chức năng xóa wifi Tầng 4 Gamma
app.delete("/api/tang4gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang4gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi Tầng 4 Gamma
app.get("/api/tang4gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi Tầng 4 Gamma
app.post("/api/tang4gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang4gamma (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi Tầng 4 Gamma (Tên + vị trí)
app.put("/api/tang4gamma/:id", async (req, res) => {
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
        UPDATE tang4gamma
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

//Chức năng xóa wifi Tầng 4 Gamma
app.delete("/api/tang4gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang4gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi Tầng 5 Gamma
app.get("/api/tang5gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang5gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới Tầng 5 Gamma
app.post("/api/tang5gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang5gamma (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi Tầng 5 Gamma (Tên + vị trí)
app.put("/api/tang5gamma/:id", async (req, res) => {
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
        UPDATE tang5gamma
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

//Chức năng xóa wifi Tầng 5 Gamma
app.delete("/api/tang5gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang5gamma WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi Tầng 5 Gamma
app.get("/api/tang5gamma", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM tang4gamma");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi Tầng 5 Gamma
app.post("/api/tang5gamma", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO tang5gamma (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi Tầng 5 Gamma (Tên + vị trí)
app.put("/api/tang5gamma/:id", async (req, res) => {
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
        UPDATE tang5gamma
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

//Chức năng xóa wifi Tầng 5 Gamma
app.delete("/api/tang5gamma/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM tang5gamma WHERE id = @id");

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

// ✅ GET - Lấy danh sách WiFi sân Vovinam
app.get("/api/vovinam", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM vovinam");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới sân vovinam
app.post("/api/vovinam", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO vovinam (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi sân vovinam (Tên + vị trí)
app.put("/api/vovinam/:id", async (req, res) => {
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
        UPDATE vovinam
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

//Chức năng xóa wifi sân vovinam
app.delete("/api/vovinam/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM vovinam WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi sân vovinam
app.get("/api/vovinam", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM vovinam");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi sân vovinam
app.post("/api/vovinam", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO vovinam (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi sân vovinam (Tên + vị trí)
app.put("/api/vovinam/:id", async (req, res) => {
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
        UPDATE vovinam
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

//Chức năng xóa wifi sân vovinam
app.delete("/api/vovinam/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM vovinam WHERE id = @id");

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

// ✅ GET - Lấy danh sách WiFi sân Vovinam
app.get("/api/vovinam", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM vovinam");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi mới sân vovinam
app.post("/api/vovinam", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO vovinam (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi sân vovinam (Tên + vị trí)
app.put("/api/vovinam/:id", async (req, res) => {
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
        UPDATE vovinam
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

//Chức năng xóa wifi sân vovinam
app.delete("/api/vovinam/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM vovinam WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ GET - Lấy danh sách WiFi sân vovinam
app.get("/api/vovinam", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM vovinam");
    console.log("🔍 Dữ liệu lấy từ SQL:", result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Lỗi truy vấn SQL:", error);
    res.status(500).json({ error: "Lỗi truy vấn SQL Server", details: error.message });
  }
});
// ✅ POST - Thêm WiFi sân vovinam
app.post("/api/vovinam", async (req, res) => {
  const { name, topPosition, leftPosition } = req.body;

  try {
    const request = new sql.Request();
    const result = await request
      .input("name", sql.NVarChar, name)
      .input("topPosition", sql.VarChar, topPosition)
      .input("leftPosition", sql.VarChar, leftPosition)
      .query(`
        INSERT INTO vovinam (Name, TopPosition, LeftPosition)
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
// ✅ PUT - Cập nhật WiFi sân vovinam (Tên + vị trí)
app.put("/api/vovinam/:id", async (req, res) => {
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
        UPDATE vovinam
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

//Chức năng xóa wifi sân vovinam
app.delete("/api/vovinam/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM vovinam WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send("WiFi không tồn tại");
    }

    res.status(200).send({ message: "✅ Xóa thành công" });
  } catch (err) {
    console.error("❌ Lỗi server khi xóa WiFi:", err);
    res.status(500).send("Lỗi server");
  }
});

// ✅ Khởi động server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  // Tự động ping các thiết bị mỗi phút
  setInterval(async () => {
    try {
      console.log('🔄 Đang tự động ping các thiết bị...');
      for (const device of wifiDevices) {
        try {
          const result = await pingDevice(device);
          await savePingResult(result);
        } catch (error) {
          console.error(`Lỗi khi tự động ping ${device.name}:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log('✅ Đã cập nhật trạng thái thiết bị');
    } catch (error) {
      console.error('Lỗi khi tự động ping:', error);
    }
  }, 1 * 60 * 1000); // 1 phút
});
