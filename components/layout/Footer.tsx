import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SkillsTube. Curated with care.
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/browse" className="hover:text-foreground transition-colors">
            All Plugins & Skills
          </Link>
          <Link href="/collections" className="hover:text-foreground transition-colors">
            Collections
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
