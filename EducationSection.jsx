import { Button } from '@/components/ui/button';
import { BookOpen, Video, FileText, Award, ChevronRight } from 'lucide-react';

export const EducationSection = () => {
  const educationResources = [
    {
      icon: BookOpen,
      title: 'Académie de Trading',
      description: 'Cours complets du débutant à l\'expert',
      lessons: '50+ leçons',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Video,
      title: 'Webinaires en Direct',
      description: 'Sessions de formation quotidiennes',
      lessons: 'Chaque jour',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: FileText,
      title: 'Analyses de Marché',
      description: 'Rapports et prévisions d\'experts',
      lessons: 'Mises à jour quotidiennes',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Award,
      title: 'Programme VIP',
      description: 'Coaching personnalisé avec traders pros',
      lessons: 'Sur inscription',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const courses = [
    {
      level: 'Débutant',
      title: 'Bases du Trading Forex',
      duration: '2 heures',
      modules: 8,
    },
    {
      level: 'Intermédiaire',
      title: 'Analyse Technique Avancée',
      duration: '4 heures',
      modules: 12,
    },
    {
      level: 'Avancé',
      title: 'Stratégies de Trading Professionnel',
      duration: '6 heures',
      modules: 15,
    },
  ];

  return (
    <section id="education" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Formation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Académie de Trading
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Optix Royal
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Développez vos compétences avec nos ressources éducatives gratuites. Du débutant au trader professionnel.
          </p>
        </div>

        {/* Education Resources */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {educationResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${resource.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${resource.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                <span className="text-xs font-semibold text-primary">{resource.lessons}</span>
              </div>
            );
          })}
        </div>

        {/* Featured Courses */}
        <div className="bg-background border border-border rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Parcours de Formation</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all duration-200"
              >
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                  {course.level}
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3">{course.title}</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{course.duration}</span>
                  <span>{course.modules} modules</span>
                </div>
                <Button variant="outline" className="w-full group" size="sm">
                  Commencer le Cours
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
            Accéder à l&apos;Académie Complète
          </Button>
        </div>
      </div>
    </section>
  );
};
