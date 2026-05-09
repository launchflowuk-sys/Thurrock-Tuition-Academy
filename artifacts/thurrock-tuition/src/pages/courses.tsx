import { useState } from "react";
import { useListCourses, getListCoursesQueryKey, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science", "11+", "Other"];
const LEVELS = ["KS2", "KS3", "GCSE", "A-Level", "11+", "General"];
const TYPES = [{ value: "group", label: "Group Session" }, { value: "individual", label: "Individual" }, { value: "online", label: "Online" }];

const emptyForm = { title: "", description: "", subject: "Maths", level: "GCSE", type: "group", price: "", duration: "", available: true, displayOrder: "0" };

export default function CoursesPage() {
  const { data: courses, isLoading } = useListCourses({ query: { queryKey: getListCoursesQueryKey() } });
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowDialog(true);
  };

  const openEdit = (course: NonNullable<typeof courses>[0]) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      subject: course.subject,
      level: course.level,
      type: course.type,
      price: String(course.price),
      duration: course.duration,
      available: course.available,
      displayOrder: String(course.displayOrder),
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.price || !form.duration) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const data = {
      title: form.title,
      description: form.description,
      subject: form.subject,
      level: form.level,
      type: form.type,
      price: Number(form.price),
      duration: form.duration,
      available: form.available,
      displayOrder: Number(form.displayOrder),
    };

    if (editingId) {
      await updateCourse.mutateAsync({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
          toast({ title: "Course updated" });
          setShowDialog(false);
        },
      });
    } else {
      await createCourse.mutateAsync({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
          toast({ title: "Course created" });
          setShowDialog(false);
        },
      });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteCourse.mutateAsync({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        toast({ title: "Course deleted" });
      },
    });
  };

  const handleToggleAvailable = async (id: number, available: boolean) => {
    await updateCourse.mutateAsync({ id, data: { available } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        toast({ title: available ? "Course is now visible" : "Course hidden from website" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Courses</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">{courses?.length ?? 0} course{courses?.length !== 1 ? "s" : ""} configured</p>
        </div>
        <Button onClick={openAdd} data-testid="button-add-course">
          <Plus size={16} className="mr-2" /> Add Course
        </Button>
      </div>

      {courses?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
          <p>No courses yet. Add your first course to display it on the website.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course) => (
            <Card key={course.id} className={`shadow-sm ${!course.available ? "opacity-60" : ""}`} data-testid={`card-course-${course.id}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base leading-tight truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{course.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(course)} data-testid={`button-edit-course-${course.id}`}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(course.id)} data-testid={`button-delete-course-${course.id}`}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">{course.subject}</Badge>
                  <Badge variant="outline" className="text-xs">{course.level}</Badge>
                  <Badge variant="outline" className="text-xs">{TYPES.find(t => t.value === course.type)?.label ?? course.type}</Badge>
                </div>

                <div className="flex items-center justify-between pt-1 border-t">
                  <div>
                    <span className="font-bold text-primary text-lg">£{Number(course.price).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground ml-1">{course.duration}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 text-xs gap-1 ${course.available ? "text-green-700 hover:text-green-800" : "text-muted-foreground"}`}
                    onClick={() => handleToggleAvailable(course.id, !course.available)}
                  >
                    {course.available ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingId ? "Edit Course" : "Add Course"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <Input placeholder="Course title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} data-testid="input-course-title" />
            <Textarea placeholder="Short description *" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} data-testid="input-course-description" />
            <div className="grid grid-cols-2 gap-3">
              <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={form.level} onValueChange={v => setForm(f => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Price (£) *" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} data-testid="input-course-price" />
              <Input placeholder="Duration e.g. 2 hrs/week *" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} data-testid="input-course-duration" />
            </div>
            <Input placeholder="Display order (0 = first)" type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="rounded" />
              Show on website (available for enrolment)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createCourse.isPending || updateCourse.isPending} data-testid="button-save-course">
              {createCourse.isPending || updateCourse.isPending ? "Saving…" : editingId ? "Update" : "Add Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
