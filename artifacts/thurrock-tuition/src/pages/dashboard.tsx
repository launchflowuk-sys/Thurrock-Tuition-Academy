import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Calendar, CreditCard, ExternalLink, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
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
    { title: "Total Students", value: summary?.totalStudents || 0, icon: Users, href: "/students", color: "text-blue-600" },
    { title: "Pending Enquiries", value: summary?.pendingEnquiries || 0, icon: MessageSquare, href: "/enquiries", color: "text-amber-600" },
    { title: "Sessions This Week", value: summary?.sessionsThisWeek || 0, icon: Calendar, href: "/sessions", color: "text-green-600" },
    { title: "Outstanding Payments", value: summary?.outstandingPayments || 0, icon: CreditCard, href: "/payments", color: "text-red-600" },
    { title: "New Intake Forms", value: summary?.newIntakeSubmissions || 0, icon: ClipboardList, href: "/intake", color: "text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-serif text-primary">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="shadow-sm border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
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

      {/* Recent Applications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-border col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-serif text-primary">Recent Applications</CardTitle>
            <Link href="/intake" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {summary?.recentEnquiries && summary.recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {summary.recentEnquiries.map((enquiry) => (
                  <Link key={enquiry.id} href="/intake">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/60 hover:border-primary/30 cursor-pointer transition-colors">
                      <div>
                        <p className="font-semibold text-foreground">{enquiry.parentName}</p>
                        <p className="text-sm text-muted-foreground">{enquiry.subject} — {enquiry.level}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
                          {enquiry.status}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                No recent applications
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
