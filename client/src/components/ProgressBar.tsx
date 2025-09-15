import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, className, showLabel = false }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)} data-testid="progress-bar-container">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progresso</span>
          <span className="text-foreground font-medium" data-testid="progress-label">
            {clampedProgress.toFixed(0)}%
          </span>
        </div>
      )}
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full progress-bar transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
          data-testid="progress-bar-fill"
        />
      </div>
    </div>
  );
}
