import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, TrendingUp, PlayCircle, Clock, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Course {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  nivel: string;
  imagemCapa: string;
  instrutorId: string;
}

interface Category {
  id: string;
  nome: string;
  descricao: string;
}

export default function PublicDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/categories')
        ]);
        
        const coursesData = await coursesRes.json();
        const categoriesData = await categoriesRes.json();
        
        setCourses(coursesData.slice(0, 6)); // Mostrar apenas 6 cursos
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Cursos Disponíveis",
      value: "500+",
      icon: BookOpen,
      description: "Cursos em diversas áreas"
    },
    {
      title: "Estudantes Ativos",
      value: "10.000+",
      icon: Users,
      description: "Aprendendo todos os dias"
    },
    {
      title: "Certificados Emitidos",
      value: "15.000+",
      icon: Award,
      description: "Conquistas alcançadas"
    },
    {
      title: "Taxa de Conclusão",
      value: "95%",
      icon: TrendingUp,
      description: "Estudantes satisfeitos"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/20 py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Bem-vindo à <span className="text-primary">PEA</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Plataforma de Educação Avançada - Descubra milhares de cursos online e desenvolva suas habilidades com os melhores instrutores do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.location.href = "/register"}
              >
                Começar Agora - Grátis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = "/courses"}
              >
                Explorar Cursos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-card/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-sm font-medium text-foreground mb-1">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Cursos em Destaque</h2>
            <p className="text-lg text-muted-foreground">Alguns dos nossos cursos mais populares</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <img 
                    src={course.imagemCapa} 
                    alt={course.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {course.nivel}
                    </Badge>
                    <span className="text-lg font-bold text-primary">
                      R$ {course.preco}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{course.titulo}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.descricao}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>8h de conteúdo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => window.location.href = "/register"}
                  >
                    Inscrever-se
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => window.location.href = "/courses"}>
              Ver Todos os Cursos
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 bg-card/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Categorias Populares</h2>
            <p className="text-lg text-muted-foreground">Explore cursos por área de interesse</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-xl">{category.nome}</CardTitle>
                  <CardDescription>{category.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Explorar Cursos →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua jornada de aprendizado?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de estudantes que já transformaram suas carreiras com nossos cursos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = "/register"}
            >
              Criar Conta Gratuita
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => window.location.href = "/login"}
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
