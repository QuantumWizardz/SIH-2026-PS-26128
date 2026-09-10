export interface ApiConfig {
  FAST_MODE: boolean;
  INJECT_FAILURE: 'none' | 'network' | 'conflict' | '500' | '403';
}

export const config: ApiConfig = {
  FAST_MODE: false,
  INJECT_FAILURE: 'none',
};

export interface RequestLog {
  id: string;
  timestamp: Date;
  method: string;
  endpoint: string;
  durationMs: number;
  payload?: any;
  response?: any;
  status: number;
}

export const requestLog: RequestLog[] = [];

export async function request<T>(endpoint: string, method: string = 'GET', payload?: any): Promise<T> {
  const start = Date.now();
  
  // 1. Simulate Latency
  const latency = config.FAST_MODE ? 10 : Math.floor(Math.random() * 280) + 120;
  await new Promise(resolve => setTimeout(resolve, latency));

  // 2. Simulate Failure
  if (config.INJECT_FAILURE !== 'none') {
    const errorState = config.INJECT_FAILURE;
    config.INJECT_FAILURE = 'none'; // reset after triggering once for predictability
    if (errorState === 'network') throw new Error('Network error');
    if (errorState === 'conflict') throw { status: 409, message: 'Conflict' };
    if (errorState === '500') throw { status: 500, message: 'Internal Server Error' };
    if (errorState === '403') throw { status: 403, message: 'Forbidden' };
  }

  // (MOCK) Route the request to internal mock handlers
  // In a real app this would be fetch()
  let response: any = { success: true }; 
  let status = 200;

  // We will build the actual routing to pure engines later.
  
  // 3. Log the call
  requestLog.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    method,
    endpoint,
    durationMs: Date.now() - start,
    payload,
    response,
    status
  });

  return response as T;
}
