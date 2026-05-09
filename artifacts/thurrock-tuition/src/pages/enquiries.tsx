import { useState } from "react";
import { useListEnquiries, getListEnquiriesQueryKey, useUpdateEnquiry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
};

export default function EnquiriesPage() {
  const { data: enquiries, isLoading } = useListEnquiries();
  const updateEnquiry = useUpdateEnquiry();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<typeof enquiries extends Array<infer T> ? T : never | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const openDialog = (enquiry: NonNullable<typeof enquiries>[number]) => {
    setSelected(enquiry as any);
    setNotes(enquiry.notes ?? "");
    setStatus(enquiry.status);
  };

  const handleSave = async () => {
    if (!selected) return;
    const raw = selected as any;
    await updateEnquiry.mutateAsync(
      { id: raw.id, data: { status, notes } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
          toast({ title: "Enquiry updated" });
          setSelected(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Enquiries</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Enquiries</h1>
        <span className="text-sm text-muted-foreground">{enquiries?.length ?? 0} total</span>
      </div>

      <div className="grid gap-4">
        {enquiries?.map((enquiry) => (
          <Card key={enquiry.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-enquiry-${enquiry.id}`}>
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{enquiry.childName}</span>
                    <span className="text-muted-foreground text-sm">aged {enquiry.childAge}</span>
                    <Badge className={`text-xs border ${statusColors[enquiry.status] ?? "bg-gray-100 text-gray-700"}`} data-testid={`badge-status-${enquiry.id}`}>
                      {enquiry.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Parent: {enquiry.parentName} · {enquiry.contactNumber}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{enquiry.subject}</span> · {enquiry.level} · Preferred: {enquiry.preferredSlot}
                  </div>
                  {enquiry.notes && (
                    <div className="text-sm text-muted-foreground italic">{enquiry.notes}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {new Date(enquiry.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => openDialog(enquiry)} data-testid={`button-edit-enquiry-${enquiry.id}`}>
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {enquiries?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No enquiries yet. They will appear here when parents submit the booking form.
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Manage Enquiry — {(selected as any)?.childName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger data-testid="select-enquiry-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this enquiry..."
                rows={4}
                data-testid="textarea-enquiry-notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateEnquiry.isPending} data-testid="button-save-enquiry">
              {updateEnquiry.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
