import Wrapper from "@/components/wrapper";
import {
  Activity,
  BarChart3,
  DollarSign,
  Package,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export default function ImageSection() {
  return (
    <Wrapper className="max-w-7xl lg:py-10">
      {/* Hero Section with Background Image */}
      <div className="relative h-[60dvh] w-full rounded-lg mb-8">
        <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
        {/* <Image
          src="/images/Macbook-Air-1674x1190 (1).png"
          alt="Admin Dashboard Background"
          fill
          className="object-cover rounded-lg"
        /> */}

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Manage your social media marketplace with powerful analytics and
              insights
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-2xl font-bold">12,847</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-bold">$89,432</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Active Services Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Services
              </p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <Activity className="w-3 h-3 mr-1" />
                +5.3% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                System Health
              </p>
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <Shield className="w-3 h-3 mr-1" />
                All systems operational
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">
                  View and edit user accounts
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="font-medium">Review Services</div>
                <div className="text-sm text-muted-foreground">
                  Approve or reject new services
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="font-medium">Analytics Report</div>
                <div className="text-sm text-muted-foreground">
                  Generate detailed reports
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">
                  Configure platform settings
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Chart Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Revenue Analytics
            </h3>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Chart component will be integrated here
                </p>
                <p className="text-xs">Showing monthly revenue trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
