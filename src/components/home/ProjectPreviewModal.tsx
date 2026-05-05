import { motion, AnimatePresence } from "motion/react";
import { Project } from "@/data/portfolio";
import { PixelClose } from "@/components/icons/PixelClose";
import { PixelGitHub } from "@/components/icons/PixelGitHub";
import { SkillIcon } from "@/components/icons/SkillIcons";
import { ExternalLink, Loader2, ChevronLeft, ChevronRight, Monitor, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectReadme } from "./ProjectReadme";
import { cn } from "@/lib/utils";

interface ProjectPreviewModalProps {
  project: Project | null;
  onClose: () => void;
}

type ViewMode = 'interactive' | 'snapshot';

export function ProjectPreviewModal({ project, onClose }: ProjectPreviewModalProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('snapshot');
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    if (project) {
      // Default to snapshot for stability and immediate visual impact
      setViewMode('snapshot');
      setCurrentImgIdx(0);
      setIsIframeLoading(true);
    }
  }, [project]);

  if (!project) return null;

  const hasScreenshots = project.screenshots && project.screenshots.length > 0;
  const hasLink = !!project.link;

  const nextImg = () => {
    if (project.screenshots) {
      setCurrentImgIdx((prev) => (prev + 1) % project.screenshots!.length);
    }
  };

  const prevImg = () => {
    if (project.screenshots) {
      setCurrentImgIdx((prev) => (prev - 1 + project.screenshots!.length) % project.screenshots!.length);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ctp-crust/95 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[95vh] md:max-h-full bg-ctp-base border-2 md:border-4 border-ctp-surface2 shadow-2xl overflow-hidden flex flex-col rounded-3xl md:rounded-[2.5rem]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-2 px-4 md:px-5 border-b border-border/30 bg-ctp-mantle/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1 md:p-1.5 bg-ctp-surface0/50 rounded-lg border border-border/20 scale-75 origin-left">
                <SkillIcon skill={project.logo} />
              </div>
              <div className="-ml-2 md:-ml-3">
                <h2 className="font-heading font-black text-sm md:text-xl text-foreground uppercase tracking-tight italic leading-none truncate max-w-[150px] md:max-w-none">
                  {project.title}
                </h2>
                <p className="text-[7px] md:text-[8px] font-mono text-muted-foreground/60 uppercase tracking-[0.1em] leading-none mt-1 truncate">
                  {project.tags.slice(0, 3).join(" • ")}
                </p>
              </div>
            </div>

            {/* View Mode Toggle - Only for Web projects with links AND screenshots */}
            {project.type === 'web' && hasLink && hasScreenshots && (
              <div className="flex items-center bg-ctp-surface0/50 p-1 rounded-xl border border-border/20 gap-1 mx-2">
                <button
                  onClick={() => setViewMode('interactive')}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                    viewMode === 'interactive' ? "bg-ctp-mauve text-background shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">Interactive</span>
                </button>
                <button
                  onClick={() => setViewMode('snapshot')}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                    viewMode === 'snapshot' ? "bg-ctp-mauve text-background shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Snapshot</span>
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-ctp-surface0 hover:bg-ctp-surface1 rounded-lg md:rounded-xl transition-all text-foreground cursor-pointer border border-border/30 group"
              aria-label="Close Preview"
            >
              <PixelClose className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Preview Container */}
            <div className="aspect-video w-full bg-ctp-crust rounded-xl border-2 border-border/30 overflow-hidden relative group shrink-0">
              {viewMode === 'interactive' && project.link ? (
                <>
                  {isIframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ctp-crust z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-ctp-mauve" />
                      <span className="font-mono text-[10px] text-muted-foreground">Initializing Preview System...</span>
                    </div>
                  )}
                  <iframe
                    src={project.link}
                    className="w-full h-full border-0"
                    onLoad={() => setIsIframeLoading(false)}
                    title={project.title}
                  />
                </>
              ) : hasScreenshots ? (
                <div className="w-full h-full relative group/carousel bg-ctp-crust">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImgIdx}
                      src={project.screenshots![currentImgIdx]} 
                      alt={`${project.title} Screenshot ${currentImgIdx + 1}`}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-contain"
                    />
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  {project.screenshots!.length > 1 && (
                    <>
                      <button 
                        onClick={prevImg}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-ctp-base/80 border border-border/30 rounded-full text-foreground hover:bg-ctp-mauve hover:text-background transition-all opacity-0 group-hover/carousel:opacity-100 z-20 cursor-pointer"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={nextImg}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-ctp-base/80 border border-border/30 rounded-full text-foreground hover:bg-ctp-mauve hover:text-background transition-all opacity-0 group-hover/carousel:opacity-100 z-20 cursor-pointer"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {project.screenshots!.map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-all",
                              i === currentImgIdx ? "bg-ctp-mauve w-4" : "bg-ctp-surface2"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ctp-surface0 p-10">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-ctp-surface1 border-4 border-dashed border-ctp-surface2 rounded-2xl mx-auto flex items-center justify-center">
                      <PixelGitHub className="w-8 h-8 md:w-10 md:h-10 text-ctp-surface2" />
                    </div>
                    <p className="font-mono text-[10px] md:text-sm text-muted-foreground max-w-[200px] md:max-w-none mx-auto">
                      Project Intel: Visit GitHub for source & visual snapshots
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Metadata */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                <div className="space-y-4">
                  <h3 className="font-heading font-black text-xl md:text-2xl text-ctp-mauve uppercase italic">
                    Operational Intel
                  </h3>
                  <p className="text-base md:text-lg text-foreground leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* README Documentation Section */}
                {project.readmeUrl && (
                  <div className="pt-6 md:pt-8 border-t border-border/30">
                    <ProjectReadme url={project.readmeUrl} />
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest border-l-2 border-ctp-blue pl-2">
                    Access Points
                  </h4>
                  <div className="flex flex-col gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-ctp-surface0 hover:bg-ctp-surface1 border border-border/50 rounded-lg transition-all group/link cursor-pointer"
                      >
                        <span className="font-bold text-sm">Live Demo</span>
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform text-ctp-sky" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-ctp-surface0 hover:bg-ctp-surface1 border border-border/50 rounded-lg transition-all group/link cursor-pointer"
                      >
                        <span className="font-bold text-sm">Source Code</span>
                        <PixelGitHub className="w-5 h-5 group-hover/link:scale-110 transition-transform text-ctp-text" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest border-l-2 border-ctp-peach pl-2">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-ctp-surface0 border border-border/30 rounded font-mono text-[9px] md:text-[10px] text-ctp-text">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
