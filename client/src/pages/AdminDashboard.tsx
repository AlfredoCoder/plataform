import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, TrendingUp, Edit, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.perfil !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "Access denied. Admin only.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: adminStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.perfil === "admin",
  });

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      
      {/* Admin Header */}
      <div className="bg-card border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="admin-title">
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground">Gestão completa da plataforma</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/dashboard"}
              data-testid="button-user-dashboard"
            >
              Dashboard Usuário
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="admin-stats-users">
                    {adminStats?.totalUsers || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Total de Usuários</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="admin-stats-courses">
                    {adminStats?.totalCourses || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Total de Cursos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="admin-stats-revenue">
                    R$ {(adminStats?.monthlyRevenue / 1000).toFixed(1)}k
                  </p>
                  <p className="text-muted-foreground text-sm">Receita do Mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="admin-stats-enrollments">
                    {adminStats?.totalEnrollments || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Matrículas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Gestão de Usuários</h2>
                <Button 
                  size="sm"
                  data-testid="button-add-user"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">A</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Admin User</h3>
                      <p className="text-muted-foreground text-sm">admin@pea.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-destructive/10 text-destructive px-2 py-1 rounded text-sm">
                      Admin
                    </span>
                    <Button variant="ghost" size="sm" data-testid="button-edit-user">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">J</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">João Silva</h3>
                      <p className="text-muted-foreground text-sm">joao@email.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      Aluno
                    </span>
                    <Button variant="ghost" size="sm" data-testid="button-edit-user">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Management */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-foreground">Gestão de Cursos</h2>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = "/create-course"}
                  data-testid="button-create-course"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Curso
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                      alt="Curso JavaScript" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">JavaScript Avançado</h3>
                      <p className="text-muted-foreground text-sm">Prof. Ana Santos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      Publicado
                    </span>
                    <Button variant="ghost" size="sm" data-testid="button-edit-course">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                      alt="Curso React" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">React do Zero ao Avançado</h3>
                      <p className="text-muted-foreground text-sm">Prof. Carlos Lima</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-sm">
                      Rascunho
                    </span>
                    <Button variant="ghost" size="sm" data-testid="button-edit-course">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Reports */}
        <Card className="mt-8 border-border">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Relatórios Financeiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2" data-testid="financial-monthly-revenue">
                  R$ {(adminStats?.monthlyRevenue || 0).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className="text-muted-foreground">Receita Mensal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2" data-testid="financial-total-payments">
                  R$ {((adminStats?.monthlyRevenue || 0) * 12).toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
                <div className="text-muted-foreground">Projeção Anual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2" data-testid="financial-average-ticket">
                  R$ {adminStats?.totalEnrollments > 0 
                    ? (adminStats.monthlyRevenue / adminStats.totalEnrollments).toFixed(2)
                    : "0.00"
                  }
                </div>
                <div className="text-muted-foreground">Ticket Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
