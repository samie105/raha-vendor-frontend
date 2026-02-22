import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage the system and review vendor submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </p>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Active Vendors
            </p>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Products
            </p>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
