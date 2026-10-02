<script lang="ts">
  import SearchOverlay from './SearchOverlay.svelte';
  import type { Post } from '../../lib/search';

  interface Props {
    value?: string;
    onChange?: (val: string) => void;
    placeholder?: string;
    class?: string;
    className?: string;
    posts?: Post[];
  }

  let {
    value = $bindable(''),
    onChange,
    placeholder = 'Search articles...',
    class: classProp = '',
    className = '',
    posts = [],
  }: Props = $props();

  let shortcutLabel = $state('Ctrl K');
  let open = $state(false);

  $effect(() => {
    if (typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)) {
      shortcutLabel = '⌘ K';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        open = !open;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  function handleSelect(post: Post) {
    open = false;
    value = post.title;
    onChange?.(post.title);
    window.location.assign(`/archives/${post.slug}`);
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    onChange?.(target.value);
  }

  const combinedClass = $derived(classProp || className || '');
</script>

<div class={`relative ${combinedClass}`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    {value}
    oninput={handleInput}
    {placeholder}
    class="w-full rounded-xl border border-border/60 bg-muted/30 pl-10 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/80 transition-all"
    aria-label={placeholder}
  />
  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
    <kbd class="inline-flex items-center rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
      {shortcutLabel}
    </kbd>
  </div>
</div>

<SearchOverlay
  {open}
  {posts}
  initialQuery={value}
  onQueryChange={(q) => {
    value = q;
    onChange?.(q);
  }}
  onClose={() => (open = false)}
  onSelect={handleSelect}
/>
