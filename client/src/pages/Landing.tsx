import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Award, Users } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 to-secondary/20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Aprenda <span className="text-primary">sem limites</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Descubra milhares de cursos online e desenvolva suas habilidades com os melhores instrutores do mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-get-started"
                >
                  Começar Agora
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = "/courses"}
                  data-testid="button-view-courses"
                >
                  Ver Cursos
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Estudante aprendendo online" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher o PEA?
            </h2>
            <p className="text-xl text-muted-foreground">
              Recursos pensados para maximizar seu aprendizado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-border">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aulas em Vídeo</h3>
                <p className="text-muted-foreground">
                  Conteúdo rico em vídeo com qualidade HD e legendas disponíveis
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certificados</h3>
                <p className="text-muted-foreground">
                  Certificados válidos com código de verificação único
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-border">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instrutores Qualificados</h3>
                <p className="text-muted-foreground">
                  Aprenda com profissionais experientes e reconhecidos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2" data-testid="stats-students">50,000+</div>
                <div className="text-primary-foreground/80">Alunos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" data-testid="stats-courses">1,200+</div>
                <div className="text-primary-foreground/80">Cursos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" data-testid="stats-instructors">200+</div>
                <div className="text-primary-foreground/80">Instrutores</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" data-testid="stats-satisfaction">95%</div>
                <div className="text-primary-foreground/80">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
