'use client';

import { useState } from 'react';
import { CreditCard, CalendarDays, MapPin, Loader2, CheckCircle, Clock, XCircle, ExternalLink, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyPayments, getPaymentReceipt, type PaymentData } from '@/services/payment.services';
import type { ApiResponse } from '@/types/api.types';
import { downloadTicketPDF } from './TicketPDF';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
    SUCCESS: { label: 'Paid', icon: CheckCircle, className: 'bg-green-50 text-green-700' },
    PENDING: { label: 'Pending', icon: Clock, className: 'bg-yellow-50 text-yellow-700' },
    FAILED: { label: 'Failed', icon: XCircle, className: 'bg-red-50 text-red-700' },
};

export default function MyPaymentsTab() {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { data: response, isLoading } = useQuery({
        queryKey: ['my-payments'],
        queryFn: getMyPayments,
        refetchOnWindowFocus: "always",
    });

    const payments = ((response as ApiResponse<PaymentData[]>)?.data || []);

    const handleDownloadTicket = async (paymentId: string) => {
        setDownloadingId(paymentId);
        try {
            const res = await getPaymentReceipt(paymentId);
            await downloadTicketPDF(res.data);
        } catch {
            alert('Failed to download ticket');
        } finally {
            setDownloadingId(null);
        }
    };

    const totalSpent = payments
        .filter((p) => p.status === 'SUCCESS')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <CreditCard className="mb-4 size-16 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700">No payments yet</h3>
                <p className="mt-1 text-sm text-gray-500">Your payment history will appear here</p>
                <Link
                    href="/events"
                    className="btn mt-4 rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                    Browse Events
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">Total Payments</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{payments.length}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">Successful</p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                        {payments.filter((p) => p.status === 'SUCCESS').length}
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600">৳{totalSpent.toLocaleString()}</p>
                </div>
            </div>

            {/* Payments List */}
            <div className="space-y-3">
                {payments.map((payment) => {
                    const config = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = config.icon;

                    return (
                        <div
                            key={payment.id}
                            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                                    <CreditCard className="size-6 text-blue-600" />
                                </div>
                                <div>
                                    <Link
                                        href={`/events/${payment.eventId}`}
                                        className="font-semibold text-gray-900 transition hover:text-blue-600 dark:text-white"
                                    >
                                        {payment.event.title}
                                    </Link>
                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        {payment.event.date && (
                                            <span className="flex items-center gap-1">
                                                <CalendarDays className="size-3.5" />
                                                {new Date(payment.event.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        )}
                                        {payment.event.venue && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3.5" />
                                                {payment.event.venue}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                        {' · '}{payment.method}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">৳{Number(payment.amount).toLocaleString()}</p>
                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
                                    <StatusIcon className="size-3.5" />
                                    {config.label}
                                </span>
                                {payment.status === 'SUCCESS' && (
                                    <button
                                        onClick={() => handleDownloadTicket(payment.id)}
                                        disabled={downloadingId === payment.id}
                                        className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                                    >
                                        {downloadingId === payment.id ? (
                                            <Loader2 className="size-3.5 animate-spin" />
                                        ) : (
                                            <Download className="size-3.5" />
                                        )}
                                        {downloadingId === payment.id ? 'Generating...' : 'Download Ticket'}
                                    </button>
                                )}
                                {payment.transactionId && (
                                    <p className="hidden text-xs text-gray-400 sm:block" title={payment.transactionId}>
                                        <ExternalLink className="mr-1 inline size-3" />
                                        {payment.transactionId.slice(0, 20)}...
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
