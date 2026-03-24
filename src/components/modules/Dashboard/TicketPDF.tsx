'use client';

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { PaymentReceipt } from '@/services/payment.services';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2px solid #3b82f6',
    },
    brand: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: '#3b82f6',
    },
    ticketLabel: {
        fontSize: 12,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        marginBottom: 6,
    },
    eventDescription: {
        fontSize: 10,
        color: '#6b7280',
        lineHeight: 1.5,
        marginBottom: 15,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0,
    },
    detailBox: {
        width: '50%',
        paddingVertical: 8,
        paddingRight: 10,
    },
    detailLabel: {
        fontSize: 9,
        color: '#9ca3af',
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    detailValue: {
        fontSize: 12,
        color: '#111827',
        fontFamily: 'Helvetica-Bold',
    },
    divider: {
        borderBottom: '1px dashed #d1d5db',
        marginVertical: 15,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    paymentLabel: {
        fontSize: 11,
        color: '#6b7280',
    },
    paymentValue: {
        fontSize: 11,
        color: '#111827',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        marginTop: 5,
        borderTop: '1px solid #e5e7eb',
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        color: '#3b82f6',
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        alignSelf: 'flex-start',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px solid #e5e7eb',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
    },
});

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const TicketDocument = ({ receipt }: { receipt: PaymentReceipt }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.brand}>Planora</Text>
                <Text style={styles.ticketLabel}>Event Ticket</Text>
            </View>

            {/* Event Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Event</Text>
                <Text style={styles.eventTitle}>{receipt.event.title}</Text>
                <Text style={styles.eventDescription}>{receipt.event.description}</Text>
            </View>

            {/* Event Details Grid */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{formatDate(receipt.event.date)}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{receipt.event.time}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Venue</Text>
                    <Text style={styles.detailValue}>{receipt.event.venue}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{receipt.event.type}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Organized By</Text>
                    <Text style={styles.detailValue}>{receipt.event.organizer.name}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Ticket Status</Text>
                    <Text style={styles.statusBadge}>{receipt.ticket.participantStatus}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Attendee Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Attendee</Text>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Name</Text>
                        <Text style={styles.detailValue}>{receipt.user.name}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>{receipt.user.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Payment Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Payment ID</Text>
                    <Text style={styles.paymentValue}>{receipt.paymentId}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Transaction ID</Text>
                    <Text style={styles.paymentValue}>{receipt.transactionId.slice(0, 30)}...</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Method</Text>
                    <Text style={styles.paymentValue}>{receipt.method}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Status</Text>
                    <Text style={styles.paymentValue}>{receipt.status}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.paymentLabel}>Paid At</Text>
                    <Text style={styles.paymentValue}>
                        {new Date(receipt.paidAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    </Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>BDT {Number(receipt.amount).toLocaleString()}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Generated by Planora Event Management Platform</Text>
                <Text style={styles.footerText}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
            </View>
        </Page>
    </Document>
);

export async function downloadTicketPDF(receipt: PaymentReceipt) {
    const blob = await pdf(<TicketDocument receipt={receipt} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `planora-ticket-${receipt.event.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
