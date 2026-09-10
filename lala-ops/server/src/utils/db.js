const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateId = (prefix) => `${prefix}_${crypto.randomBytes(4).toString('hex')}`;

// Helper methods mapped to Supabase
const addActivityLog = async (requestId, action, actor, details = '') => {
  const log = {
    id: generateId('log'),
    request_id: requestId, // Note: DB column is request_id
    action,
    actor,
    details,
    // timestamp is default now() in DB
  };
  
  const { data, error } = await supabase
    .from('activity_logs')
    .insert([log])
    .select()
    .single();
    
  if (error) console.error("Error adding activity log:", error);
  
  // Transform DB keys back to camelCase for the frontend if needed, but the frontend
  // expects 'requestId' although it doesn't really use it in the log array.
  // Wait, let's keep the return shape compatible.
  if (data) {
    return {
      ...data,
      requestId: data.request_id
    };
  }
  return log;
};

const getRequests = async () => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
  return data;
};

const getRequestById = async (id) => {
  const { data: request, error: reqError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (reqError || !request) {
    console.error("Error fetching request:", reqError);
    return null;
  }
  
  const { data: activityLogs, error: actError } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('request_id', id)
    .order('timestamp', { ascending: true });
    
  if (actError) {
    console.error("Error fetching activity logs:", actError);
  }
  
  // Transform activity logs to match frontend expectations if necessary
  // (Frontend expects 'actor', 'action', 'details', 'timestamp')
  return {
    ...request,
    activity: activityLogs || []
  };
};

const getRequestActivity = async (requestId) => {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('request_id', requestId)
    .order('timestamp', { ascending: true });
    
  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
  return data;
};

const addRequest = async (data, actor = 'System') => {
  const request = {
    id: generateId('req'),
    title: data.title || 'Untitled Request',
    description: data.description || '',
    client: data.client || 'Unknown',
    category: data.category || 'General',
    priority: data.priority || 'Medium',
    deadline: data.deadline || null,
    status: 'New Request',
    assignee: null,
    // created_at is default now() in DB
  };
  
  const { data: savedRequest, error } = await supabase
    .from('requests')
    .insert([request])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating request:", error);
    throw error;
  }
  
  await addActivityLog(savedRequest.id, 'Request created', actor, `New request created from client: ${savedRequest.client}`);
  
  return savedRequest;
};

const updateRequest = async (id, updates, actor = 'System') => {
  // First get the old request to compare
  const { data: oldRequest, error: fetchError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single();
    
  if (fetchError || !oldRequest) {
    console.error("Error fetching old request for update:", fetchError);
    return null;
  }

  // Then update
  const { data: newRequest, error: updateError } = await supabase
    .from('requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (updateError) {
    console.error("Error updating request:", updateError);
    return null;
  }
  
  // Log status change
  if (updates.status && updates.status !== oldRequest.status) {
    await addActivityLog(id, 'Status changed', actor, `Status changed from "${oldRequest.status}" to "${updates.status}"`);
  }

  // Log assignee change
  if (updates.assignee !== undefined && updates.assignee !== oldRequest.assignee) {
    const actionMsg = updates.assignee ? `Employee assigned: ${updates.assignee}` : 'Employee unassigned';
    await addActivityLog(id, 'Assignment changed', actor, actionMsg);
  }

  return newRequest;
};

const getDashboardStats = async () => {
  let waitingForUs = 0;
  let waitingForClient = 0;
  let unassigned = 0;
  let overdue = 0;

  const now = new Date();

  // Fetch all requests to calculate stats. Alternatively, we could do count queries, 
  // but since we need multiple different conditions and this is an MVP, fetching all is fine.
  const { data: requests, error } = await supabase
    .from('requests')
    .select('status, assignee, deadline');
    
  if (error) {
    console.error("Error fetching requests for stats:", error);
    return { waitingForUs, waitingForClient, unassigned, overdue };
  }

  requests.forEach(req => {
    // Waiting for us
    if (req.status === 'New Request' || req.status === 'Needs Clarification') {
      waitingForUs++;
    }

    // Waiting for client
    if (req.status === 'Waiting on Client') {
      waitingForClient++;
    }

    // Unassigned (Ready to Assign but no assignee)
    if (req.status === 'Ready to Assign' && !req.assignee) {
      unassigned++;
    }

    // Overdue (In Progress and deadline passed)
    if (req.status === 'In Progress' && req.deadline) {
      const deadlineDate = new Date(req.deadline);
      if (deadlineDate < now) {
        overdue++;
      }
    }
  });

  return { waitingForUs, waitingForClient, unassigned, overdue };
};

module.exports = {
  getRequests,
  getRequestById,
  getRequestActivity,
  addRequest,
  updateRequest,
  addActivityLog,
  getDashboardStats
};
