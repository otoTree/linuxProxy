import type { Request, Response } from 'express';
import { exec } from 'child_process';
import { sessionManager } from '../services/sessionManager';

// Original simple command execution
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

// Session Management

export const createSession = (req: Request, res: Response) => {
  try {
    const sessionId = sessionManager.createSession();
    res.json({ sessionId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const executeSessionCommand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { command } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  if (!command) {
    res.status(400).json({ error: 'Command is required' });
    return;
  }

  const success = sessionManager.write(id, command + '\n'); // Append newline to execute
  if (!success) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  // Wait briefly for output (e.g., 200ms) to make it feel responsive for quick commands
  // Note: This is optional. The client could also poll immediately after.
  await new Promise(resolve => setTimeout(resolve, 200));

  const output = sessionManager.read(id);
  res.json({ output });
};

export const getSessionOutput = (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  const output = sessionManager.read(id);
  
  if (output === null) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  res.json({ output });
};

export const resizeSession = (req: Request, res: Response) => {
  const { id } = req.params;
  const { cols, rows } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }
  
  if (!cols || !rows) {
     res.status(400).json({ error: 'cols and rows are required' });
     return;
  }

  const success = sessionManager.resize(id, parseInt(cols as string), parseInt(rows as string));
  if (!success) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  res.json({ success: true });
};

export const destroySession = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  const success = sessionManager.destroy(id);
  
  if (!success) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  res.json({ success: true });
};
