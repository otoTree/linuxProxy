export const config = {
  port: process.env.PORT || 3001,
  apiToken: process.env.API_TOKEN,
  report: {
    interval: Number(process.env.MS) || 30000,
    to: process.env.TO || 'admin@agentos.com',
    url: process.env.REPORT_URL,
  },
};
