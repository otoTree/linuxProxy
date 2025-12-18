import app from './app';
import { config } from './config';
import { startSystemReportTask } from './tasks/systemReportTask';

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  startSystemReportTask();
});
