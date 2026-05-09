import { useState } from "react";
import {
  useListStaff, getListStaffQueryKey,
  useCreateStaff, useUpdateStaff, useDeleteStaff,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, User, Clock, PoundSterling } from "lucide-react";
import type { StaffMember } from "@workspace/api-client-react";

const ROLES = ["Tutor", "Senior Tutor", "Admin", "Assistant"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "Tutor",
  hourlyRate: "",
  hoursPerWeek: "",
  notes: "",
};

export default function StaffPage() {
  const { data: staff, isLoading } = useListStaff({ query: { queryKey: getListStaffQueryKey() } });
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowDialog(true);
  };

  const openEdit = (member: StaffMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone ?? "",
      role: member.role,
      hourlyRate: member.hourlyRate !== null ? String(member.hourlyRate) : "",
      hoursPerWeek: member.hoursPerWeek !== null ? String(member.hoursPerWeek) : "",
      notes: member.notes ?? "",
    });
    setShowDialog(true);
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListStaffQueryKey() });

  const handleSave = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      role: form.role,
      hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
      hoursPerWeek: form.hoursPerWeek ? Number(form.hoursPerWeek) : undefined,
      notes: form.notes || undefined,
    };

    if (editingId) {
      await updateStaff.mutateAsync(
        { id: editingId, data: payload },
        { onSuccess: () => { invalidate(); toast({ title: "Staff member updated" }); setShowDialog(false); } }
      );
    } else {
      await createStaff.mutateAsync(
        { data: { ...payload, name: form.name, email: form.email, role: form.role } },
        { onSuccess: () => { invalidate(); toast({ title: "Staff member added" }); setShowDialog(false); } }
      );
    }
  };

  const handleDelete = async (id: number) => {
    await deleteStaff.mutateAsync(
      { id },
      { onSuccess: () => { invalidate(); toast({ title: "Staff member removed" }); setDeleteConfirmId(null); } }
    );
  };

  const isPending = createStaff.isPending || updateStaff.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Staff</h1>
        <Button onClick={openAdd} data-testid="button-add-staff">
          <Plus size={16} className="mr-2" /> Add Staff Member
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">Loading staff...</div>
      )}

      {!isLoading && staff?.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No staff members yet</p>
          <p className="text-sm mt-1">Add your first tutor or staff member to get started.</p>
        </div>
      )}

      <div className="grid gap-4">
        {staff?.map((member) => (
          <Card key={member.id} className="shadow-sm hover:shadow-md transition-shadow" data-testid={`card-staff-${member.id}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User size={22} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <Badge variant="outline" className="text-xs capitalize">{member.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{member.email}</p>
                    {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {member.hourlyRate !== null && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PoundSterling size={12} />
                          £{Number(member.hourlyRate).toFixed(2)}/hr
                        </span>
                      )}
                      {member.hoursPerWeek !== null && member.hoursPerWeek !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {member.hoursPerWeek} hrs/week
                        </span>
                      )}
                    </div>
                    {member.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{member.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(member)} data-testid={`button-edit-staff-${member.id}`}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirmId(member.id)} data-testid={`button-delete-staff-${member.id}`}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Full name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} data-testid="input-staff-name" />
            <Input placeholder="Email address *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} data-testid="input-staff-email" />
            <Input placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} data-testid="input-staff-phone" />
            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger data-testid="select-staff-role"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Hourly rate (£)" type="number" step="0.01" value={form.hourlyRate} onChange={e => setForm(f => ({ ...f, hourlyRate: e.target.value }))} data-testid="input-staff-rate" />
              <Input placeholder="Hours per week" type="number" value={form.hoursPerWeek} onChange={e => setForm(f => ({ ...f, hoursPerWeek: e.target.value }))} data-testid="input-staff-hours" />
            </div>
            <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} data-testid="textarea-staff-notes" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.email || isPending} data-testid="button-save-staff">
              {isPending ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Remove Staff Member?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this staff member from the system.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)} disabled={deleteStaff.isPending}>
              {deleteStaff.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
