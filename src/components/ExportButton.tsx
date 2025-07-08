'use client';

import { LocalStorage } from '@/utils/storage';
import { Download } from 'lucide-react';

export function ExportButton() {
  const handleExport = () => {
    try {
      const csvData = LocalStorage.exportToCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </button>
  );
}
