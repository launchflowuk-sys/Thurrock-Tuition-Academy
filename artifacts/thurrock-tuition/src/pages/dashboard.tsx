import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, CreditCard, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const QUICK_LINKS = [
  {
    label: "Google Drive",
    url: "https://drive.google.com",
    description: "Shared documents & resources",
    emoji: "📁",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    label: "OneDrive",
    url: "https://onedrive.live.com",
    description: "Microsoft cloud storage",
    emoji: "☁️",
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100",
    textColor: "text-sky-700",
  },
  {
    label: "Khan Academy",
    url: "https://www.khanacademy.org",
    description: "Free maths & science lessons",
    emoji: "🎓",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    textColor: "text-green-700",
  },
  {
    label: "BBC Bitesize",
    url: "https://www.bbc.co.uk/bitesize",
    description: "KS2, KS3, GCSE revision",
    emoji: "📚",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
    textColor: "text-red-700",
  },
  {
    label: "Seneca Learning",
    url: "https://senecalearning.com",
    description: "Smart revision platform",
    emoji: "🧠",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    label: "Corbettmaths",
    url: "https://corbettmaths.com",
    description: "Maths videos & worksheets",
    emoji: "➕",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    textColor: "text-orange-700",
  },
];

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
    { title: "Total Students", value: summary?.totalStudents || 0, icon: Users },
    { title: "Pending Enquiries", value: summary?.pendingEnquiries || 0, icon: MessageSquare },
    { title: "Sessions This Week", value: summary?.sessionsThisWeek || 0, icon: Calendar },
    { title: "Outstanding Payments", value: summary?.outstandingPayments || 0, icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-serif text-primary">Dashboard Overview</h1>

      {/* Stats */}
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

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-primary mb-4">Quick Links</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${link.color}`}
            >
              <span className="text-2xl shrink-0">{link.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${link.textColor}`}>{link.label}</p>
                <p className="text-xs text-muted-foreground truncate">{link.description}</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-muted-foreground/60" />
            </a>
          ))}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="grid gap-6 md:grid-cols-2">
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
                      <p className="text-sm text-muted-foreground">{enquiry.subject} — {enquiry.level}</p>
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
