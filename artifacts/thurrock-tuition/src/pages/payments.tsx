import { useListPayments, getListPaymentsQueryKey, useUpdatePayment, useListStudents } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle } from "lucide-react";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useListPayments(undefined, { query: { queryKey: getListPaymentsQueryKey() } });
  const { data: students } = useListStudents();
  const updatePayment = useUpdatePayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const studentMap = Object.fromEntries(students?.map(s => [s.id, s.name]) ?? []);

  const handleMarkPaid = async (id: number) => {
    await updatePayment.mutateAsync(
      { id, data: { paid: true } },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey() }); toast({ title: "Marked as paid" }); } }
    );
  };

  const outstanding = payments?.filter(p => !p.paid) ?? [];
  const paid = payments?.filter(p => p.paid) ?? [];
  const totalOutstanding = outstanding.reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Payments</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Payments</h1>
        {outstanding.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total outstanding</p>
            <p className="text-2xl font-bold text-amber-600">£{totalOutstanding.toFixed(2)}</p>
          </div>
        )}
      </div>

      {outstanding.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-amber-700">Outstanding ({outstanding.length})</h2>
          <div className="grid gap-3">
            {outstanding.map((payment) => (
              <Card key={payment.id} className="shadow-sm border-amber-200" data-testid={`card-payment-${payment.id}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-muted-foreground" />
                      <span className="font-semibold">{studentMap[payment.studentId] ?? `Student #${payment.studentId}`}</span>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">Outstanding</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">£{Number(payment.amount).toFixed(2)} · Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}</p>
                    {payment.notes && <p className="text-xs text-muted-foreground italic">{payment.notes}</p>}
                  </div>
                  <Button size="sm" onClick={() => handleMarkPaid(payment.id)} data-testid={`button-mark-paid-${payment.id}`}>
                    <CheckCircle size={14} className="mr-1" /> Mark Paid
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {paid.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-green-700">Paid ({paid.length})</h2>
          <div className="grid gap-3">
            {paid.map((payment) => (
              <Card key={payment.id} className="shadow-sm border-green-200 opacity-70" data-testid={`card-payment-paid-${payment.id}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-muted-foreground" />
                      <span className="font-medium">{studentMap[payment.studentId] ?? `Student #${payment.studentId}`}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Paid</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">£{Number(payment.amount).toFixed(2)} · Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}</p>
                  </div>
                  <CheckCircle size={18} className="text-green-500 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {payments?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No payment records yet. Add them from individual student profiles.</div>
      )}
    </div>
  );
}
