import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-serif text-primary">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: summary?.totalStudents || 0,
      icon: Users,
    },
    {
      title: "Pending Enquiries",
      value: summary?.pendingEnquiries || 0,
      icon: MessageSquare,
    },
    {
      title: "Sessions This Week",
      value: summary?.sessionsThisWeek || 0,
      icon: Calendar,
    },
    {
      title: "Outstanding Payments",
      value: summary?.outstandingPayments || 0,
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-serif text-primary">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="shadow-sm border-border col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-primary">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.recentEnquiries && summary.recentEnquiries.length > 0 ? (
              <div className="space-y-4">
                {summary.recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                    <div>
                      <p className="font-semibold text-foreground">{enquiry.parentName}</p>
                      <p className="text-sm text-muted-foreground">{enquiry.subject} - {enquiry.level}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
                        {enquiry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                No recent enquiries
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}