import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Award, Clock, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ProgressBar";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/my/enrollments"],
    enabled: isAuthenticated,
  });

  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ["/api/my/certificates"],
    enabled: isAuthenticated,
  });

  if (isLoading || enrollmentsLoading || certificatesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const activeCourses = enrollments.filter((e: any) => e.status === "ativo");
  const completedCourses = enrollments.filter((e: any) => e.status === "concluido");

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      
      {/* Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="dashboard-title">
                Meu Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="dashboard-welcome">
                Bem-vindo de volta, {user?.firstName || "Estudante"}!
              </p>
            </div>
            {user?.perfil === "admin" && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/admin"}
                data-testid="button-admin-area"
              >
                Área Admin
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="stats-enrolled-courses">
                    {enrollments.length}
                  </p>
                  <p className="text-muted-foreground text-sm">Cursos Inscritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="stats-completed-courses">
                    {completedCourses.length}
                  </p>
                  <p className="text-muted-foreground text-sm">Cursos Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="stats-certificates">
                    {certificates.length}
                  </p>
                  <p className="text-muted-foreground text-sm">Certificados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground" data-testid="stats-study-hours">
                    {Math.floor(Math.random() * 200) + 50}
                  </p>
                  <p className="text-muted-foreground text-sm">Horas de Estudo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Courses */}
          <Card className="border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Cursos em Andamento</h2>
              {activeCourses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Você não está matriculado em nenhum curso no momento.
                </p>
              ) : (
                <div className="space-y-4">
                  {activeCourses.map((enrollment: any) => (
                    <div 
                      key={enrollment.id} 
                      className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                      data-testid={`course-enrollment-${enrollment.id}`}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=150" 
                        alt="Curso" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          Curso ID: {enrollment.cursoId}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Matriculado em {new Date(enrollment.dataInscricao).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="text-foreground font-medium">0%</span>
                          </div>
                          <ProgressBar progress={0} className="w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card className="border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Certificados Recentes</h2>
              {certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Você ainda não possui certificados.
                </p>
              ) : (
                <div className="space-y-4">
                  {certificates.slice(0, 3).map((certificate: any) => (
                    <div 
                      key={certificate.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                      data-testid={`certificate-${certificate.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Certificado #{certificate.codigoVerificacao.slice(0, 8)}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            Emitido em {new Date(certificate.dataEmissao).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        data-testid={`button-download-certificate-${certificate.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
