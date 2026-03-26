'use client';

import { AlertTriangle, MoreVertical } from 'lucide-react';

const reports = [
    { id: 1, type: 'Spam', target: 'Summer Music Festival', reporter: 'Alex Turner', date: '2026-03-18', status: 'PENDING' },
    { id: 2, type: 'Inappropriate Content', target: 'Review by user123', reporter: 'Priya Sharma', date: '2026-03-17', status: 'PENDING' },
    { id: 3, type: 'Fake Event', target: 'Free Concert Tickets', reporter: 'Emily Davis', date: '2026-03-15', status: 'RESOLVED' },
];

export default function AdminReports() {
    return (
        <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Reports ({reports.length})</h2>
            <div className="space-y-3">
                {reports.map((report) => (
                    <div key={report.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                                report.status === 'PENDING' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400'
                            }`}
                        >
                            <AlertTriangle className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{report.type}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Target: {report.target} &middot; Reported by: {report.reporter}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400">{new Date(report.date).toLocaleDateString()}</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                report.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                            }`}
                        >
                            {report.status}
                        </span>
                        <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800">
                            <MoreVertical className="size-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
