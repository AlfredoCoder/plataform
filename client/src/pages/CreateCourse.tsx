import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Video, Trash2, X, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { insertCourseSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";

const createCourseFormSchema = insertCourseSchema.extend({
  modules: z.array(z.object({
    title: z.string().min(1, "Título do módulo é obrigatório"),
    description: z.string().optional(),
    lessons: z.array(z.object({
      titulo: z.string().min(1, "Título da aula é obrigatório"),
      tipo: z.enum(["video", "artigo", "quiz"]),
      duracao: z.number().optional(),
    })),
  })).optional(),
});

type CreateCourseForm = z.infer<typeof createCourseFormSchema>;

export default function CreateCourse() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [modules, setModules] = useState([{ 
    title: "", 
    description: "", 
    lessons: [{ titulo: "", tipo: "video" as const, duracao: 0 }] 
  }]);

  const form = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseFormSchema.omit({ modules: true })),
    defaultValues: {
      titulo: "",
      descricao: "",
      preco: "0",
      nivel: "iniciante",
      status: "rascunho",
      idioma: "pt-BR",
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/courses", data);
      return response.json();
    },
    onSuccess: (course) => {
      toast({
        title: "Sucesso!",
        description: "Curso criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      window.location.href = "/admin";
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Erro",
        description: "Falha ao criar curso. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CreateCourseForm) => {
    if (!user || (user.perfil !== "instrutor" && user.perfil !== "admin")) {
      toast({
        title: "Acesso negado",
        description: "Apenas instrutores e administradores podem criar cursos.",
        variant: "destructive",
      });
      return;
    }

    const courseData = {
      ...data,
      preco: data.preco ? data.preco.toString() : "0",
    };

    createCourseMutation.mutate(courseData);
  };

  const addModule = () => {
    setModules([...modules, { 
      title: "", 
      description: "", 
      lessons: [{ titulo: "", tipo: "video" as const, duracao: 0 }] 
    }]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({ titulo: "", tipo: "video" as const, duracao: 0 });
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(newModules);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules];
    (newModules[index] as any)[field] = value;
    setModules(newModules);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const newModules = [...modules];
    (newModules[moduleIndex].lessons[lessonIndex] as any)[field] = value;
    setModules(newModules);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="create-course-title">
                Criar Novo Curso
              </h1>
              <p className="text-muted-foreground">Configure os detalhes do seu curso</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/admin"}
              data-testid="button-back-admin"
            >
              ← Voltar ao Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Curso</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: JavaScript do Zero ao Profissional" 
                            {...field}
                            data-testid="input-course-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoriaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nivel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-level">
                              <SelectValue placeholder="Selecione o nível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="iniciante">Iniciante</SelectItem>
                            <SelectItem value="intermediario">Intermediário</SelectItem>
                            <SelectItem value="avancado">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="197.00" 
                            {...field}
                            data-testid="input-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            placeholder="Descreva o que os alunos irão aprender..." 
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-foreground">Módulos do Curso</h2>
                  <Button 
                    type="button" 
                    onClick={addModule}
                    data-testid="button-add-module"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Módulo
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Módulo {moduleIndex + 1}</h3>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeModule(moduleIndex)}
                          data-testid={`button-remove-module-${moduleIndex}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Título do Módulo
                          </label>
                          <Input 
                            placeholder="Ex: Introdução ao JavaScript" 
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                            data-testid={`input-module-title-${moduleIndex}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Duração Estimada
                          </label>
                          <Input 
                            placeholder="Ex: 2h 30min" 
                            data-testid={`input-module-duration-${moduleIndex}`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Descrição do Módulo
                        </label>
                        <Textarea 
                          rows={2} 
                          placeholder="Descreva o conteúdo deste módulo..." 
                          value={module.description}
                          onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                          data-testid={`textarea-module-description-${moduleIndex}`}
                        />
                      </div>
                      
                      {/* Lessons */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-foreground">Aulas</h4>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => addLesson(moduleIndex)}
                            data-testid={`button-add-lesson-${moduleIndex}`}
                          >
                            + Adicionar Aula
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                              <select 
                                className="px-2 py-1 border border-input rounded text-sm bg-background"
                                value={lesson.tipo}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'tipo', e.target.value)}
                                data-testid={`select-lesson-type-${moduleIndex}-${lessonIndex}`}
                              >
                                <option value="video">Vídeo</option>
                                <option value="artigo">Artigo</option>
                                <option value="quiz">Quiz</option>
                              </select>
                              <Input 
                                className="flex-1" 
                                placeholder="Título da aula" 
                                value={lesson.titulo}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'titulo', e.target.value)}
                                data-testid={`input-lesson-title-${moduleIndex}-${lessonIndex}`}
                              />
                              <Input 
                                className="w-20" 
                                placeholder="15min" 
                                type="number"
                                value={lesson.duracao || 0}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duracao', parseInt(e.target.value) || 0)}
                                data-testid={`input-lesson-duration-${moduleIndex}-${lessonIndex}`}
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                data-testid={`button-remove-lesson-${moduleIndex}-${lessonIndex}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Media */}
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Mídia do Curso</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Imagem de Capa
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Clique para fazer upload ou arraste uma imagem</p>
                      <p className="text-muted-foreground text-sm mt-1">PNG, JPG até 2MB</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vídeo de Apresentação
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Clique para fazer upload ou arraste um vídeo</p>
                      <p className="text-muted-foreground text-sm mt-1">MP4, AVI até 50MB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => window.location.href = "/admin"}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => {
                  const draftData = { ...form.getValues(), status: "rascunho" };
                  createCourseMutation.mutate(draftData);
                }}
                disabled={createCourseMutation.isPending}
                data-testid="button-save-draft"
              >
                Salvar como Rascunho
              </Button>
              <Button 
                type="submit" 
                disabled={createCourseMutation.isPending}
                data-testid="button-publish-course"
              >
                {createCourseMutation.isPending ? "Criando..." : "Publicar Curso"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
