import { SkillCard } from '@/components/ui/SkillCard';
import type { SerializedSkill } from '@/db/schema';
import { cn } from '@/lib/utils';

type RecentlyAddedProps = {
  skills: SerializedSkill[];
  className?: string;
};

export function RecentlyAdded({ skills, className }: RecentlyAddedProps) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Recently Added
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The newest curated skills on the directory.
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
