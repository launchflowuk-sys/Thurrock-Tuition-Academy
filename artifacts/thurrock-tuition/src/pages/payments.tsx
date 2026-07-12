import { useState } from "react";
import { useListPayments, getListPaymentsQueryKey, useUpdatePayment, useListStudents, useSendPaymentLink } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle, Clock, XCircle, Send, Link as LinkIcon, Repeat } from "lucide-react";

type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled" | "link_sent";

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; badge: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pending: { label: "Pending", color: "amber", badge: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  paid: { label: "Paid", color: "green", badge: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  overdue: { label: "Overdue", color: "red", badge: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "gray", badge: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
  link_sent: { label: "Link Sent", color: "blue", badge: "bg-blue-100 text-blue-800 border-blue-200", icon: LinkIcon },
};

const EMPTY_LINK_FORM = { studentId: "", amount: "", description: "", isRecurring: false, billingDay: "1" };

export default function PaymentsPage() {
  const { data: payments, isLoading } = useListPayments(undefined, { query: { queryKey: getListPaymentsQueryKey() } });
  const { data: students } = useListStudents();
  const updatePayment = useUpdatePayment();
  const sendPaymentLink = useSendPaymentLink();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkForm, setLinkForm] = useState(EMPTY_LINK_FORM);

  const studentMap = Object.fromEntries(students?.map(s => [s.id, s.name]) ?? []);

  // Recurring billing follows each student's most recent payment row, so only
  // that row's "Stop recurring" toggle actually affects future auto-billing.
  const latestRecurringIdByStudent = new Map<number, number>();
  for (const p of payments ?? []) {
    if (!p.isRecurring) continue;
    const existingId = latestRecurringIdByStudent.get(p.studentId);
    const existing = payments?.find(x => x.id === existingId);
    if (!existing || new Date(p.createdAt) >= new Date(existing.createdAt)) {
      latestRecurringIdByStudent.set(p.studentId, p.id);
    }
  }

  const handleStopRecurring = async (id: number) => {
    await updatePayment.mutateAsync(
      { id, data: { isRecurring: false } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
          toast({ title: "Recurring billing stopped for this student" });
        },
      }
    );
  };

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

  const handleSendPaymentLink = async () => {
    const studentId = Number(linkForm.studentId);
    const amount = Number(linkForm.amount);
    if (!studentId || !amount || amount <= 0 || !linkForm.description.trim()) {
      toast({ title: "Please select a student, amount, and description", variant: "destructive" });
      return;
    }
    try {
      await sendPaymentLink.mutateAsync({
        data: {
          studentId,
          amount,
          description: linkForm.description.trim(),
          isRecurring: linkForm.isRecurring,
          ...(linkForm.isRecurring ? { billingDay: Number(linkForm.billingDay) } : {}),
        },
      });
      queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() });
      toast({ title: "Payment link sent", description: "The parent has been emailed a link to pay." });
      setLinkDialogOpen(false);
      setLinkForm(EMPTY_LINK_FORM);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast({
        title: "Failed to send payment link",
        description: msg ?? "Check that Square is configured in Settings → Payments.",
        variant: "destructive",
      });
    }
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
              {payment.isRecurring && (
                <Badge variant="outline" className="text-xs">
                  <Repeat size={10} className="mr-1 inline" />
                  Monthly · day {payment.billingDay}
                </Badge>
              )}
              {payment.isRecurring && latestRecurringIdByStudent.get(payment.studentId) === payment.id && (
                <button
                  type="button"
                  onClick={() => handleStopRecurring(payment.id)}
                  className="text-xs text-muted-foreground underline hover:text-destructive"
                  data-testid={`button-stop-recurring-${payment.id}`}
                >
                  Stop recurring
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              £{Number(payment.amount).toFixed(2)} · Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}
            </p>
            {payment.notes && <p className="text-xs text-muted-foreground italic">{payment.notes}</p>}
            {payment.paymentLinkUrl && status !== "paid" && (
              <a
                href={payment.paymentLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline inline-flex items-center gap-1"
              >
                <LinkIcon size={10} /> View payment link
              </a>
            )}
          </div>
          {payment.squarePaymentId ? (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs border shrink-0" data-testid={`badge-square-paid-${payment.id}`}>
              <CheckCircle size={10} className="mr-1 inline" />
              Paid via Square
            </Badge>
          ) : (
            <Select
              value={status}
              onValueChange={(val) => handleStatusChange(payment.id, val)}
            >
              <SelectTrigger className="w-32 shrink-0 h-8 text-xs" data-testid={`select-status-${payment.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="link_sent">Link Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
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
          <Button onClick={() => setLinkDialogOpen(true)} className="gap-2" data-testid="button-send-payment-link">
            <Send size={15} />
            Send Payment Link
          </Button>
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

      <Dialog open={linkDialogOpen} onOpenChange={(open) => { setLinkDialogOpen(open); if (!open) setLinkForm(EMPTY_LINK_FORM); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Send Payment Link</DialogTitle>
            <p className="text-sm text-muted-foreground">Generates a Square payment link and emails it to the parent.</p>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="block text-sm font-semibold mb-1.5">Student</Label>
              <Select value={linkForm.studentId} onValueChange={(val) => setLinkForm(f => ({ ...f, studentId: val }))}>
                <SelectTrigger data-testid="select-link-student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-semibold mb-1.5">Amount (£)</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={linkForm.amount}
                onChange={e => setLinkForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="120.00"
                data-testid="input-link-amount"
              />
            </div>
            <div>
              <Label className="block text-sm font-semibold mb-1.5">Description</Label>
              <Input
                value={linkForm.description}
                onChange={e => setLinkForm(f => ({ ...f, description: e.target.value }))}
                placeholder="March tuition"
                data-testid="input-link-description"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="link-recurring" className="text-sm font-semibold">Recurring monthly</Label>
              <Switch
                id="link-recurring"
                checked={linkForm.isRecurring}
                onCheckedChange={(checked) => setLinkForm(f => ({ ...f, isRecurring: checked }))}
              />
            </div>
            {linkForm.isRecurring && (
              <div>
                <Label className="block text-sm font-semibold mb-1.5">Billing day of month</Label>
                <Select value={linkForm.billingDay} onValueChange={(val) => setLinkForm(f => ({ ...f, billingDay: val }))}>
                  <SelectTrigger data-testid="select-link-billing-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">A new link is automatically generated and emailed on this day every month.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendPaymentLink} disabled={sendPaymentLink.isPending} className="gap-2">
              <Send size={15} />
              {sendPaymentLink.isPending ? "Sending…" : "Send Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
