
import { Layout } from '@/components/Layout';
import { BusMap } from '@/components/BusMap';
import { Button } from '@/components/ui/button';
import { LocateFixed, List } from 'lucide-react';
import { useState } from 'react';

const BusTracker = () => {
  const [showBusList, setShowBusList] = useState(false);

  return (
    <Layout requireRole="passenger">
      <div className="h-screen relative">
        {/* Map taking 60% of the screen */}
        <div className="h-[60vh] relative">
          <BusMap className="w-full h-full" />
          
          <div className="map-controls">
            <Button variant="secondary" size="icon">
              <LocateFixed className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => setShowBusList(!showBusList)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bus information panel */}
        <div className="h-[40vh] bg-background border-t">
          <div className="container py-4">
            <h2 className="text-2xl font-bold mb-4">Nearby Buses</h2>
            <div className="space-y-4">
              {/* Demo bus entries */}
              <div className="bus-info-card">
                <h3 className="font-semibold">Bus #123</h3>
                <p className="text-sm text-muted-foreground">Route: Downtown Express</p>
                <p className="text-sm text-muted-foreground">Arriving in: 5 mins</p>
              </div>
              <div className="bus-info-card">
                <h3 className="font-semibold">Bus #456</h3>
                <p className="text-sm text-muted-foreground">Route: Airport Shuttle</p>
                <p className="text-sm text-muted-foreground">Arriving in: 12 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusTracker;
