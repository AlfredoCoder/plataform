import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    titulo: string;
    descricao?: string;
    preco?: string;
    nivel?: string;
    instrutorId: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const handleViewCourse = () => {
    window.location.href = `/courses/${course.id}`;
  };

  return (
    <Card 
      className="course-card border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleViewCourse}
      data-testid={`course-card-${course.id}`}
    >
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250" 
          alt={course.titulo}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 left-4">
          <Badge 
            variant={course.nivel === "iniciante" ? "secondary" : course.nivel === "intermediario" ? "default" : "destructive"}
            className="bg-white/90 text-foreground"
          >
            {course.nivel === "iniciante" ? "Iniciante" : 
             course.nivel === "intermediario" ? "Intermediário" : 
             course.nivel === "avancado" ? "Avançado" : "Iniciante"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2" data-testid={`course-title-${course.id}`}>
          {course.titulo}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`course-description-${course.id}`}>
          {course.descricao || "Curso com conteúdo de qualidade para seu aprendizado."}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>4h 30min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>1.2k alunos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary" data-testid={`course-price-${course.id}`}>
              R$ {course.preco || "197,00"}
            </span>
            <span className="text-sm text-muted-foreground line-through ml-2">
              R$ {course.preco ? (parseFloat(course.preco) * 1.5).toFixed(2) : "297,00"}
            </span>
          </div>
          <Button 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCourse();
            }}
            data-testid={`button-view-course-${course.id}`}
          >
            Ver Curso
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
