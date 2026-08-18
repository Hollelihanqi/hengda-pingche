const { spawn } = require('child_process');

// Parse and normalize CLI arguments from the dev script
const rawArgs = process.argv.slice(2);
const cleanArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    // Skip '--host' and the next value (e.g. '0.0.0.0') or convert to -H
    if (rawArgs[i + 1] && !rawArgs[i + 1].startsWith('-')) {
      cleanArgs.push('-H', rawArgs[i + 1]);
      i++;
    }
  } else if (arg.startsWith('--host=')) {
    const val = arg.split('=')[1];
    cleanArgs.push('-H', val);
  } else {
    cleanArgs.push(arg);
  }
}

// Ensure default host and port if not specified
if (!cleanArgs.includes('-H') && !cleanArgs.includes('--hostname')) {
  cleanArgs.push('-H', '0.0.0.0');
}
if (!cleanArgs.includes('-p') && !cleanArgs.includes('--port')) {
  cleanArgs.push('-p', '3000');
}

console.log('[Dev Runner] Starting Next.js with args:', cleanArgs.join(' '));

const nextBin = require.resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, 'dev', 'web', ...cleanArgs], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('[Dev Runner] Failed to start next dev:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code || 0);
  }
});
