import { useState } from "react";
import { useListPayments, getListPaymentsQueryKey, useUpdatePayment, useListStudents } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";

type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; badge: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pending: { label: "Pending", color: "amber", badge: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  paid: { label: "Paid", color: "green", badge: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  overdue: { label: "Overdue", color: "red", badge: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "gray", badge: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
};

export default function PaymentsPage() {
  const { data: payments, isLoading } = useListPayments(undefined, { query: { queryKey: getListPaymentsQueryKey() } });
  const { data: students } = useListStudents();
  const updatePayment = useUpdatePayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const studentMap = Object.fromEntries(students?.map(s => [s.id, s.name]) ?? []);

  const handleStatusChange = async (id: number, status: string) => {
    await updatePayment.mutateAsync(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
          toast({ title: `Payment marked as ${status}` });
        },
      }
    );
  };

  const filtered = payments?.filter(p => filterStatus === "all" || p.status === filterStatus) ?? [];

  const pending = payments?.filter(p => p.status === "pending") ?? [];
  const overdue = payments?.filter(p => p.status === "overdue") ?? [];
  const paid = payments?.filter(p => p.status === "paid") ?? [];
  const cancelled = payments?.filter(p => p.status === "cancelled") ?? [];
  const unpaidTotal = [...pending, ...overdue].reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Payments</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  const PaymentCard = ({ payment }: { payment: NonNullable<typeof payments>[0] }) => {
    const status = (payment.status ?? "pending") as PaymentStatus;
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;

    return (
      <Card
        key={payment.id}
        className={`shadow-sm transition-opacity ${status === "cancelled" ? "opacity-60" : ""}`}
        data-testid={`card-payment-${payment.id}`}
      >
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CreditCard size={14} className="text-muted-foreground shrink-0" />
              <span className="font-semibold truncate">{studentMap[payment.studentId] ?? `Student #${payment.studentId}`}</span>
              <Badge className={`${cfg.badge} text-xs border`}>
                <Icon size={10} className="mr-1 inline" />
                {cfg.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              £{Number(payment.amount).toFixed(2)} · Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}
            </p>
            {payment.notes && <p className="text-xs text-muted-foreground italic">{payment.notes}</p>}
          </div>
          <Select
            value={status}
            onValueChange={(val) => handleStatusChange(payment.id, val)}
          >
            <SelectTrigger className="w-32 shrink-0 h-8 text-xs" data-testid={`select-status-${payment.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Payments</h1>
          {unpaidTotal > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Outstanding: <span className="font-bold text-amber-600">£{unpaidTotal.toFixed(2)}</span>
              {overdue.length > 0 && <span className="text-red-600 ml-2">· {overdue.length} overdue</span>}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({payments?.length ?? 0})</SelectItem>
              <SelectItem value="pending">Pending ({pending.length})</SelectItem>
              <SelectItem value="overdue">Overdue ({overdue.length})</SelectItem>
              <SelectItem value="paid">Paid ({paid.length})</SelectItem>
              <SelectItem value="cancelled">Cancelled ({cancelled.length})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {payments?.length === 0
            ? "No payment records yet. Add them from individual student profiles."
            : `No ${filterStatus === "all" ? "" : filterStatus} payments found.`}
        </div>
      )}
    </div>
  );
}
