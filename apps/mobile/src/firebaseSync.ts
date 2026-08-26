// Firebase Cloud Firestore REST Bridge for React Native Mobile

const API_KEY = 'AIzaSyBWv-Vf_c9bmZRVUc-G_jrF60f3-SN-XdA';
const PROJECT_ID = 'kavexa-ops';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/workspaces/kavexa_main?key=${API_KEY}`;

// Helper to convert Firestore JSON values into plain JS objects
function decodeFirestoreValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(decodeFirestoreValue);
  }
  if ('mapValue' in val) {
    const obj: any = {};
    const fields = val.mapValue.fields || {};
    for (const k in fields) {
      obj[k] = decodeFirestoreValue(fields[k]);
    }
    return obj;
  }
  return null;
}

// Helper to convert plain JS object into Firestore JSON values
function encodeFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: val.toString() };
    return { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(encodeFirestoreValue)
      }
    };
  }
  if (typeof val === 'object') {
    const fields: any = {};
    for (const k in val) {
      fields[k] = encodeFirestoreValue(val[k]);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export interface WorkspaceData {
  projects: any[];
  tasks: any[];
  studyTasks: any[];
  files: any[];
  members: any[];
  resources: any[];
  ideas: any[];
  schedules: any[];
}

export async function fetchWorkspaceData(): Promise<WorkspaceData | null> {
  try {
    const res = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn('[MobileSync] Fetch returned status:', res.status);
      return null;
    }

    const json = await res.json();
    if (!json.fields) return null;

    const decoded: any = {};
    for (const k in json.fields) {
      decoded[k] = decodeFirestoreValue(json.fields[k]);
    }

    return {
      projects: Array.isArray(decoded.projects) ? decoded.projects : [],
      tasks: Array.isArray(decoded.tasks) ? decoded.tasks : [],
      studyTasks: Array.isArray(decoded.studyTasks) ? decoded.studyTasks : [],
      files: Array.isArray(decoded.files) ? decoded.files : [],
      members: Array.isArray(decoded.members) ? decoded.members : [],
      resources: Array.isArray(decoded.resources) ? decoded.resources : [],
      ideas: Array.isArray(decoded.ideas) ? decoded.ideas : [],
      schedules: Array.isArray(decoded.schedules) ? decoded.schedules : []
    };
  } catch (err) {
    console.warn('[MobileSync] Network read error:', err);
    return null;
  }
}

export async function saveWorkspaceData(data: Partial<WorkspaceData>): Promise<boolean> {
  try {
    // Current remote data fetch first to merge safely
    const current = await fetchWorkspaceData();
    const merged = {
      projects: data.projects ?? current?.projects ?? [],
      tasks: data.tasks ?? current?.tasks ?? [],
      studyTasks: data.studyTasks ?? current?.studyTasks ?? [],
      files: data.files ?? current?.files ?? [],
      members: data.members ?? current?.members ?? [],
      resources: data.resources ?? current?.resources ?? [],
      ideas: data.ideas ?? current?.ideas ?? [],
      schedules: data.schedules ?? current?.schedules ?? [],
      lastUpdated: new Date().toISOString()
    };

    const fields: any = {};
    for (const k in merged) {
      fields[k] = encodeFirestoreValue((merged as any)[k]);
    }

    const res = await fetch(BASE_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });

    if (!res.ok) {
      console.warn('[MobileSync] Patch returned status:', res.status);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[MobileSync] Network write error:', err);
    return false;
  }
}
