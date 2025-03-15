
import { Layout } from '@/components/Layout';
import { BusMap } from '@/components/BusMap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LocateFixed, List } from 'lucide-react';
import { useState } from 'react';

// Mock bus data for demonstration
const MOCK_BUS_INFO = [
  { id: 'bus-1', name: 'Bus #123', route: 'Downtown Express', arrivalTime: '5 mins' },
  { id: 'bus-2', name: 'Bus #456', route: 'Airport Shuttle', arrivalTime: '12 mins' },
  { id: 'bus-3', name: 'Bus #789', route: 'Uptown Local', arrivalTime: '3 mins' },
];

const BusTracker = () => {
  const [showBusList, setShowBusList] = useState(false);

  return (
    <Layout requireRole="passenger">
      <div className="h-screen relative">
        {/* Map taking 60% of the screen */}
        <div className="h-[60vh] relative">
          <BusMap className="w-full h-full" />
          
          <div className="absolute right-4 top-16 z-10">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => setShowBusList(!showBusList)}
              className="bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bus information panel */}
        <div className="h-[40vh] bg-background border-t">
          <div className="container py-4">
            <h2 className="text-2xl font-bold mb-4">Nearby Buses</h2>
            <div className="space-y-4 overflow-auto max-h-[calc(40vh-80px)]">
              {/* Real-time bus entries */}
              {MOCK_BUS_INFO.map(bus => (
                <Card key={bus.id} className="bus-info-card p-4">
                  <h3 className="font-semibold">{bus.name}</h3>
                  <p className="text-sm text-muted-foreground">Route: {bus.route}</p>
                  <p className="text-sm text-muted-foreground">Arriving in: {bus.arrivalTime}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusTracker;
