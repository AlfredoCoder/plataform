import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Settings, Award, BookOpen, Upload } from "lucide-react";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary" data-testid="nav-logo">
                <a href="/">PEA</a>
              </h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a 
                href="/" 
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-link-home"
              >
                Início
              </a>
              <a 
                href="/courses" 
                className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                data-testid="nav-link-courses"
              >
                Cursos
              </a>
              {isAuthenticated && (
                <a 
                  href="/dashboard" 
                  className="text-muted-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="nav-link-dashboard"
                >
                  Dashboard
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  data-testid="nav-button-login"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={handleRegister}
                  data-testid="nav-button-register"
                >
                  Cadastrar
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="nav-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm" data-testid="nav-user-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground" data-testid="nav-user-email">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"} data-testid="nav-menu-dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  {user?.perfil === "admin" && (
                    <DropdownMenuItem onClick={() => window.location.href = "/admin"} data-testid="nav-menu-admin">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Administração</span>
                    </DropdownMenuItem>
                  )}
                  {(user?.perfil === "instrutor" || user?.perfil === "admin") && (
                    <>
                      <DropdownMenuItem onClick={() => window.location.href = "/create-course"} data-testid="nav-menu-create-course">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Criar Curso</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = "/upload-video"} data-testid="nav-menu-upload-video">
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload de Vídeos</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = "/my-certificates"} data-testid="nav-menu-certificates">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Meus Certificados</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="nav-menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
