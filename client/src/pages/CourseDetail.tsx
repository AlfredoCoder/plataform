import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Users, Play, FileText, Star, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function CourseDetail() {
  const { id } = useParams();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["/api/courses", id],
    enabled: !!id,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["/api/courses", id, "lessons"],
    enabled: !!id,
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/courses", id, "reviews"],
    enabled: !!id,
  });

  if (courseLoading || lessonsLoading || reviewsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Curso não encontrado</h1>
          <p className="text-muted-foreground mb-8">O curso que você está procurando não existe.</p>
          <Button onClick={() => window.location.href = "/courses"}>
            Ver Todos os Cursos
          </Button>
        </div>
      </div>
    );
  }

  // Group lessons by module
  const moduleMap = lessons.reduce((acc: any, lesson: any) => {
    const moduleTitle = lesson.moduloTitulo || 'Módulo Principal';
    if (!acc[moduleTitle]) {
      acc[moduleTitle] = [];
    }
    acc[moduleTitle].push(lesson);
    return acc;
  }, {});

  const modules = Object.entries(moduleMap);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  {course.nivel || 'Iniciante'}
                </Badge>
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                  Desenvolvimento Web
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4" data-testid="course-title">
                {course.titulo}
              </h1>
              <p className="text-xl text-primary-foreground/90 mb-6" data-testid="course-description">
                {course.descricao}
              </p>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Instrutor: {course.instrutorId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{lessons.reduce((total: number, lesson: any) => total + (lesson.duracao || 0), 0)} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>1.2k alunos</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  data-testid="button-enroll-course"
                >
                  Inscrever-se - R$ {course.preco || '197,00'}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  data-testid="button-preview"
                >
                  Prévia Gratuita
                </Button>
              </div>
            </div>
            <div>
              <div className="relative bg-card rounded-xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450" 
                  alt="Preview do curso" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    data-testid="button-play-preview"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Modules */}
            <Card className="border-border mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Conteúdo do Curso</h2>
                <div className="space-y-4">
                  {modules.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Conteúdo em desenvolvimento...
                    </p>
                  ) : (
                    modules.map(([moduleTitle, moduleLessons]: [string, any[]]) => (
                      <div key={moduleTitle} className="border border-border rounded-lg">
                        <div className="p-4 bg-muted/30 cursor-pointer" data-testid={`module-${moduleTitle}`}>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{moduleTitle}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground text-sm">
                                {moduleLessons.reduce((total, lesson) => total + (lesson.duracao || 0), 0)} min
                              </span>
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          {moduleLessons.map((lesson: any) => (
                            <div key={lesson.id} className="flex items-center justify-between" data-testid={`lesson-${lesson.id}`}>
                              <div className="flex items-center space-x-3">
                                {lesson.tipo === 'video' ? (
                                  <Play className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className="text-foreground">{lesson.titulo}</span>
                              </div>
                              <span className="text-muted-foreground text-sm">
                                {lesson.duracao ? `${lesson.duracao}min` : '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Avaliações dos Alunos</h2>
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Ainda não há avaliações para este curso.
                    </p>
                  ) : (
                    reviews.map((review: any) => (
                      <div key={review.id} className="flex space-x-4" data-testid={`review-${review.id}`}>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-semibold">U</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-foreground">Usuário</span>
                            <div className="flex items-center">
                              {Array.from({ length: review.nota }, (_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comentario}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Detalhes do Curso</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nível</span>
                    <span className="text-foreground font-medium">{course.nivel || 'Iniciante'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="text-foreground font-medium">
                      {Math.ceil(lessons.reduce((total: number, lesson: any) => total + (lesson.duracao || 0), 0) / 60)} horas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aulas</span>
                    <span className="text-foreground font-medium">{lessons.length} aulas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idioma</span>
                    <span className="text-foreground font-medium">{course.idioma || 'Português'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificado</span>
                    <span className="text-foreground font-medium">Sim</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-2" data-testid="course-price">
                      R$ {course.preco || '197,00'}
                    </div>
                    <div className="text-muted-foreground text-sm line-through mb-4">
                      R$ {course.preco ? (parseFloat(course.preco) * 1.5).toFixed(2) : '297,00'}
                    </div>
                    <Button 
                      className="w-full mb-3"
                      data-testid="button-enroll-now"
                    >
                      Inscrever-se Agora
                    </Button>
                    <p className="text-muted-foreground text-sm">Garantia de 30 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
