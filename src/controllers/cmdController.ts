import type { Request, Response } from 'express';
import { exec } from 'child_process';

export const executeCommand = (req: Request, res: Response) => {
  const { command } = req.body;

  if (!command) {
    res.status(400).json({ error: 'Command is required' });
    return;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ 
        error: error.message,
        stderr,
        stdout
      });
      return;
    }
    res.json({ stdout, stderr });
  });
};
