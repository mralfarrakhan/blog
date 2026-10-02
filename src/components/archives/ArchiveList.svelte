<script module lang="ts">
  import type { Post } from '../../lib/search';
  import type { TagInfo } from '../../lib/tags';

  export type { Post, TagInfo };

  export type ArchiveListProps = {
    posts?: Post[];
    initialQuery?: string;
    tags?: TagInfo[];
  };
</script>

<script lang="ts">
  import SearchBar from './SearchBar.svelte';
  import { getAllTags, slugifyTag } from '../../lib/tags';
  import { searchPosts } from '../../lib/search';

  interface Props {
    posts?: Post[];
    initialQuery?: string;
    tags?: TagInfo[];
  }

  let { posts = [], initialQuery = '', tags }: Props = $props();

  let query = $state(initialQuery || '');

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

  $effect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q !== null) {
          query = q;
        }
      } catch {}
    }
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const currentQ = params.get('q') ?? '';
      const nextQ = (query || '').trim();
      if (currentQ !== nextQ) {
        if (nextQ) {
          params.set('q', nextQ);
        } else {
          params.delete('q');
        }
        const qs = params.toString();
        const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch {}
  });

  const allTags = $derived(tags && tags.length > 0 ? tags : getAllTags(posts));
  const filteredPosts = $derived(searchPosts(posts || [], query || ''));
  const safePosts = $derived(filteredPosts || []);
</script>

<div class="max-w-3xl mx-auto">
  <div class="mb-10">
    <div class="max-w-md">
      <SearchBar
        bind:value={query}
        placeholder="Search articles..."
        {posts}
      />
    </div>
    {#if allTags.length > 0}
      <div class="mt-4 flex flex-wrap gap-2">
        {#each allTags as tag (tag.slug)}
          <a
            href={`/tags/${tag.slug}`}
            class="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-accent/40 hover:text-accent hover:bg-card"
          >
            <span class="text-accent/70 font-mono">#</span>
            <span class="font-medium text-foreground/90 group-hover:text-accent">{tag.name}</span>
            <span class="text-muted-foreground/60 text-[11px] font-mono ml-0.5">{tag.count}</span>
          </a>
        {/each}
      </div>
    {/if}
    <div class="mt-4 border-b border-border/100"></div>
  </div>

  {#if safePosts.length === 0}
    <div class="text-center text-muted-foreground py-12" aria-live="polite" role="status">
      No matching articles found.
    </div>
  {:else}
    <div class="space-y-10 sm:space-y-12">
      {#each safePosts as post (post.slug)}
        <article class="group">
          <div class="flex items-start justify-between gap-6 sm:gap-8">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors text-balance">
                <a href={`/archives/${post.slug}`} class="hover:text-primary">
                  {post.title}
                </a>
              </h3>
              <p class="mt-2 mb-3 text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                {post.excerpt}
              </p>
              {#if post.tags && post.tags.length > 0}
                <div class="flex flex-wrap gap-1.5">
                  {#each post.tags as tag (tag)}
                    <a
                      href={`/tags/${slugifyTag(tag)}`}
                      class="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <span class="text-accent/70">#</span>
                      <span>{tag}</span>
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
            <div class="text-right shrink-0 whitespace-nowrap pt-0.5">
              <time class="text-xs sm:text-sm text-muted-foreground block">
                {formatDisplayDate(post.date)}
              </time>
              {#if typeof post.readMinutes === 'number'}
                <span class="text-xs text-muted-foreground/70 block mt-0.5">
                  {post.readMinutes} min read
                </span>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>
