import { SkillCard } from '@/components/ui/SkillCard';
import type { SerializedSkill } from '@/db/schema';
import { cn } from '@/lib/utils';

type FeaturedSkillsProps = {
  skills: SerializedSkill[];
  className?: string;
};

export function FeaturedSkills({ skills, className }: FeaturedSkillsProps) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Featured Skills
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Standalone skills hand-picked for quality and usefulness.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
}
