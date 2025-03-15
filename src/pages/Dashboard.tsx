
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Navigation, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <Layout requireAuth requireRole="driver">
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Driver Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-transit-500" />
                <h2 className="text-xl font-semibold">Current Location</h2>
              </div>
              <p className="text-muted-foreground mb-4">Your current location will be shared with passengers</p>
              <Button>
                Update Location
              </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Navigation className="w-6 h-6 text-transit-500" />
                <h2 className="text-xl font-semibold">Active Route</h2>
              </div>
              <p className="text-muted-foreground mb-4">Downtown Express</p>
              <Button variant="outline">
                Change Route
              </Button>
            </Card>

            <Card className="p-6 md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <Settings className="w-6 h-6 text-transit-500" />
                <h2 className="text-xl font-semibold">Route Settings</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">Configure your route settings and preferences</p>
                <Button variant="outline">
                  Manage Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
