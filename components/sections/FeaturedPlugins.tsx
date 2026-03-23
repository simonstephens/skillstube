import { PluginCard } from '@/components/ui/PluginCard';
import type { SerializedPlugin } from '@/db/schema';
import { cn } from '@/lib/utils';

type FeaturedPluginsProps = {
  plugins: Array<SerializedPlugin & { skillCount: number }>;
  className?: string;
};

export function FeaturedPlugins({ plugins, className }: FeaturedPluginsProps) {
  if (plugins.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Featured Plugins
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Multi-skill plugins curated for quality and safety.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      </div>
    </section>
  );
}
