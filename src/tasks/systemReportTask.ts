import os from 'os';
import { config } from '../config';
import { getLocalIp } from '../utils/ip';

async function reportSystemStatus(url: string) {
  try {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const uptime = os.uptime();
    const localIp = getLocalIp();

    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      ip: localIp,
      cpus: cpus.length,
      cpuModel: cpus[0]?.model,
      loadAvg, // [1min, 5min, 15min]
      memory: {
        total: totalMem,
        free: freeMem,
        used: totalMem - freeMem,
      },
      uptime,
      timestamp: new Date().toISOString(),
      port: config.port, // Include port as requested to report system info including port configuration
    };

    const formData = new FormData();
    formData.append('from', localIp);
    formData.append('to', config.report.to);
    formData.append('subject', `System Status Report - ${systemInfo.hostname}`);
    formData.append('text', JSON.stringify(systemInfo, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    // We just log if it fails or succeeds
    if (!response.ok) {
      console.error(`Failed to report system status: ${response.status} ${response.statusText}`);
    } else {
      console.log(`System status reported successfully to ${url}`);
    }
  } catch (error) {
    console.error('Error reporting system status:', error);
  }
}

export function startSystemReportTask() {
  const reportUrl = config.report.url;
  
  if (!reportUrl) {
    console.log('REPORT_URL environment variable is not set. System reporting task disabled.');
    return;
  }

  console.log(`Starting system reporting task. Sending stats to ${reportUrl} every ${config.report.interval}ms.`);

  // Send immediately on start
  reportSystemStatus(reportUrl);

  setInterval(() => {
    reportSystemStatus(reportUrl);
  }, config.report.interval); 
}
