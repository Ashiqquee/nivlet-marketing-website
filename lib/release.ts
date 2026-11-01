// Current download, written by scripts/sync-release.mjs from a verified distribute.py candidate.
import data from './release.json';

const macOSNames: Record<string, string> = { '14': 'macOS Sonoma', '15': 'macOS Sequoia', '26': 'macOS Tahoe', '27': 'macOS Golden Gate' };

export const release = {
  ...data,
  // Decimal megabytes, matching the size Finder shows for the download.
  size: `${(data.bytes / 1e6).toFixed(1)} MB`,
  macOS: `macOS ${data.minimumMacOS.replace(/\.0$/, '')} or later`,
  macOSName: macOSNames[data.minimumMacOS.split('.')[0]] ?? `macOS ${data.minimumMacOS.replace(/\.0$/, '')}`,
};
