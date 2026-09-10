const db = require('../utils/db');

exports.createRequest = async (req, res) => {
  try {
    const data = req.body;
    // In a real app, AI extraction would happen here before saving.
    // For MVP, we simulate that the client sends the extracted data.
    const newRequest = await db.addRequest(data, 'Client System / AI');
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await db.getRequests();
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error getting requests:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const requestData = await db.getRequestById(id);
    if (!requestData) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: requestData });
  } catch (error) {
    console.error("Error getting request by id:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['New Request', 'Needs Clarification', 'Ready to Assign', 'In Progress', 'Waiting on Client', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedRequest = await db.updateRequest(id, { status }, 'Manager');
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.assignEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;

    const updatedRequest = await db.updateRequest(id, { assignee }, 'Manager');
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error assigning employee:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
