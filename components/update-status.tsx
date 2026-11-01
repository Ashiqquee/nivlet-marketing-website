'use client';
import { useEffect, useState } from 'react';
import { release } from '@/lib/release';

// The app's Check for Updates… opens /releases/?installed=<version>&build=<build>.
// Compared in the browser; nothing is sent anywhere.
export function UpdateStatus() {
  const [installed, setInstalled] = useState<{ version: string; build: number } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const version = params.get('installed'), build = Number(params.get('build'));
    if (version && Number.isInteger(build) && build > 0) setInstalled({ version, build });
  }, []);
  if (!installed) return null;
  const current = installed.build >= Number(release.build);
  return <p className="notice" role="status">
    {current
      ? <>You have the latest version of Nivlet.</>
      : <>A newer version of Nivlet is available. Download it below, then follow the update steps.</>}
  </p>;
}
