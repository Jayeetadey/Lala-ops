const db = require('../utils/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
