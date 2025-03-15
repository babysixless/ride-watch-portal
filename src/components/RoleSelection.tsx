
import { Bus, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export const RoleSelection = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'driver' | 'passenger') => {
    setRole(role);
    if (role === 'driver') {
      navigate('/login');
    } else {
      navigate('/bus-tracker');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transit-50 to-transit-100 p-4">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transit-900">Welcome to BusTracker</h1>
        <p className="text-lg text-center mb-12 text-transit-800">Please select your role to continue</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="role-card group"
            onClick={() => handleRoleSelect('passenger')}
          >
            <User className="w-16 h-16 mb-4 text-transit-500 group-hover:text-transit-600" />
            <h2 className="text-2xl font-semibold mb-2">Passenger</h2>
            <p className="text-muted-foreground text-center">Track buses in real-time and plan your journey</p>
          </Card>

          <Card 
            className="role-card group"
            onClick={() => handleRoleSelect('driver')}
          >
            <Bus className="w-16 h-16 mb-4 text-transit-500 group-hover:text-transit-600" />
            <h2 className="text-2xl font-semibold mb-2">Driver</h2>
            <p className="text-muted-foreground text-center">Log in to manage your route and update your location</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
