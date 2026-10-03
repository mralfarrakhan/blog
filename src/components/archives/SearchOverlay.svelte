<script lang="ts">
  import { searchPosts, type Post } from '$lib/search';

  interface Props {
    open: boolean;
    posts?: Post[];
    initialQuery?: string;
    onQueryChange?: (value: string) => void;
    onClose: () => void;
    onSelect: (post: Post) => void;
  }

  let {
    open,
    posts = [],
    initialQuery = '',
    onQueryChange,
    onClose,
    onSelect,
  }: Props = $props();

  let query = $state('');
  let activeIndex = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);
  let listEl = $state<HTMLDivElement | null>(null);

  const results = $derived(searchPosts(posts || [], query || ''));

  function formatDisplayDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        });
      }
    } catch {}
    return dateStr;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      },
    };
  }

  $effect(() => {
    if (!open) return;
    query = initialQuery ?? '';
    activeIndex = 0;
    requestAnimationFrame(() => inputEl?.focus());
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  });

  $effect(() => {
    if (open) {
      onQueryChange?.(query);
    }
  });

  $effect(() => {
    if (results.length === 0) {
      activeIndex = 0;
    } else if (activeIndex >= results.length) {
      activeIndex = results.length - 1;
    }
  });

  $effect(() => {
    if (!open) return;
    // Track activeIndex for scroll into view
    void activeIndex;
    listEl?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  });

  $effect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (results.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % results.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + results.length) % results.length;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const post = results[activeIndex];
        if (post) onSelect(post);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

{#if open}
  <div
    use:portal
    role="dialog"
    aria-modal="true"
    aria-label="Search articles"
    class="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 pb-10 pt-[14vh] backdrop-blur-sm dark:bg-black/60"
    onclick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div class="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl">
      <div class="flex items-center gap-3 border-b border-border px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          class="shrink-0 text-muted-foreground"
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
          bind:this={inputEl}
          type="text"
          bind:value={query}
          placeholder="Search articles..."
          aria-label="Search articles"
          class="w-full bg-transparent py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        <kbd class="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
          esc
        </kbd>
      </div>

      <div bind:this={listEl} class="max-h-[46vh] overflow-y-auto py-1.5">
        {#if results.length === 0}
          <div class="px-4 py-12 text-center text-sm text-muted-foreground" aria-live="polite">
            No matching articles found{query.trim() ? ` for "${query.trim()}"` : ''}.
          </div>
        {:else}
          {#each results as post, idx (post.slug)}
            {@const active = idx === activeIndex}
            <a
              href={`/archives/${post.slug}`}
              data-active={active ? 'true' : undefined}
              onmouseenter={() => (activeIndex = idx)}
              onclick={() => onSelect(post)}
              class="mx-1.5 block rounded-lg px-3 py-2.5 transition-colors {active ? 'bg-muted' : 'hover:bg-muted/60'}"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-semibold transition-colors {active ? 'text-accent' : 'text-foreground'}">
                    {post.title}
                  </h4>
                  <p class="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{post.excerpt}</p>
                </div>
                <time class="shrink-0 whitespace-nowrap pt-0.5 text-xs text-muted-foreground/70">
                  {formatDisplayDate(post.date)}
                </time>
              </div>
              {#if (post.tags && post.tags.length > 0) || typeof post.readMinutes === 'number'}
                <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {#if post.tags}
                    {#each post.tags.slice(0, 3) as tag (tag)}
                      <span class="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        <span class="text-accent/70">#</span>
                        {tag}
                      </span>
                    {/each}
                  {/if}
                  {#if typeof post.readMinutes === 'number'}
                    <span class="text-[11px] text-muted-foreground/60">{post.readMinutes} min read</span>
                  {/if}
                </div>
              {/if}
            </a>
          {/each}
        {/if}
      </div>

      <footer class="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
        <span class="inline-flex items-center gap-1.5">
          <kbd class="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">↑</kbd>
          <kbd class="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">↓</kbd>
          Navigate
        </span>
        <span class="inline-flex items-center gap-1.5">
          <kbd class="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">↵</kbd>
          Open
        </span>
        <span class="ml-auto inline-flex items-center gap-1.5">
          <kbd class="inline-flex items-center rounded border border-border/80 bg-card/60 px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">esc</kbd>
          Close
        </span>
      </footer>
    </div>
  </div>
{/if}
