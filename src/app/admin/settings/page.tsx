'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('MVEE Clothing');
  const [currency, setCurrency] = useState('ZAR');

  const saveSettings = () => {
    // Persist later (DB / API)
    alert('Settings saved');
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Store Settings</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-stone-600">Store Name</label>
          <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
        </div>

        <div>
          <label className="text-sm text-stone-600">Currency</label>
          <Input value={currency} onChange={e => setCurrency(e.target.value)} />
        </div>
      </div>

      <Button onClick={saveSettings} className="bg-black hover:bg-black/80">
        Save Settings
      </Button>
    </div>
  );
}
