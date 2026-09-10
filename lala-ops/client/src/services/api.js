import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 8)}`;

export const checkHealth = async () => {
  return { status: 'OK', message: 'Serverless mode active' };
};

// Helper method for activity logging
const addActivityLog = async (requestId, action, actor, details = '') => {
  const log = {
    id: generateId('log'),
    request_id: requestId,
    action,
    actor,
    details,
  };
  
  const { error } = await supabase.from('activity_logs').insert([log]);
  if (error) console.error("Error adding activity log:", error);
};

export const getDashboardStats = async () => {
  let waitingForUs = 0;
  let waitingForClient = 0;
  let unassigned = 0;
  let overdue = 0;

  const now = new Date();

  const { data: requests, error } = await supabase
    .from('requests')
    .select('status, assignee, deadline');
    
  if (error) {
    console.error("Error fetching stats:", error);
    return { waitingForUs, waitingForClient, unassigned, overdue };
  }

  requests.forEach(req => {
    if (req.status === 'New Request' || req.status === 'Needs Clarification') {
      waitingForUs++;
    }
    if (req.status === 'Waiting on Client') {
      waitingForClient++;
    }
    if (req.status === 'Ready to Assign' && !req.assignee) {
      unassigned++;
    }
    if (req.status === 'In Progress' && req.deadline) {
      const deadlineDate = new Date(req.deadline);
      if (deadlineDate < now) {
        overdue++;
      }
    }
  });

  return { waitingForUs, waitingForClient, unassigned, overdue };
};

export const getRequests = async () => {
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

export const getRequestById = async (id) => {
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
    
  if (actError) console.error("Error fetching activity logs:", actError);
  
  return {
    ...request,
    activity: activityLogs || []
  };
};

export const createRequest = async (data) => {
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
  };
  
  const { data: savedRequest, error } = await supabase
    .from('requests')
    .insert([request])
    .select()
    .single();
    
  if (error) throw error;
  
  await addActivityLog(savedRequest.id, 'Request created', 'Client System / AI', `New request created from client: ${savedRequest.client}`);
  return savedRequest;
};

export const updateRequestStatus = async (id, status) => {
  const { data: oldRequest } = await supabase.from('requests').select('status').eq('id', id).single();
  
  const { data: newRequest, error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  if (oldRequest && oldRequest.status !== status) {
    await addActivityLog(id, 'Status changed', 'Manager', `Status changed from "${oldRequest.status}" to "${status}"`);
  }
  
  return newRequest;
};

export const assignEmployee = async (id, assignee) => {
  const { data: oldRequest } = await supabase.from('requests').select('assignee').eq('id', id).single();

  const { data: newRequest, error } = await supabase
    .from('requests')
    .update({ assignee })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  if (oldRequest && oldRequest.assignee !== assignee) {
    const actionMsg = assignee ? `Employee assigned: ${assignee}` : 'Employee unassigned';
    await addActivityLog(id, 'Assignment changed', 'Manager', actionMsg);
  }
  
  return newRequest;
};
