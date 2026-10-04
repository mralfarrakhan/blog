<script lang="ts">
  import { getRandomQuote, type Quote } from '$lib/quotes';
  import { onMount } from 'svelte';

  let quote = $state<Quote>();
  let loading = $state(true);

  onMount(async () => {
    try {
      const response = await fetch('/api/data/quote.json');
      if (response.ok) {
        const data = await response.json<{ quote: Quote }>();
        quote = data.quote;
      } else {
        quote = getRandomQuote();
      }
    } catch {
      quote = getRandomQuote();
    } finally {
      loading = false;
    }
  });
</script>

<div
  class="border-border/70 bg-card not-prose my-12 rounded-lg border p-6 sm:p-7"
>
  {#if quote}
    <div class="flex flex-col items-center space-y-3 text-center">
      <svg
        class="text-muted-foreground/35 h-6 w-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path
          d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
        />
      </svg>
      <blockquote
        class="text-foreground/90 max-w-xl font-sans text-base leading-relaxed text-pretty italic sm:text-lg"
      >
        "{quote.text}"
      </blockquote>
      <div class="text-muted-foreground pt-1 font-mono text-xs">
        <span class="text-foreground/80 font-medium">{quote.author}</span>
        {#if quote.source}
          <span class="text-muted-foreground/70 ml-1.5"
            >&mdash; {quote.source}</span
          >
        {/if}
      </div>
    </div>
  {:else if loading}
    <div
      class="flex animate-pulse flex-col items-center space-y-3"
      aria-hidden="true"
    >
      <div class="bg-muted/60 h-6 w-6 rounded"></div>
      <div class="bg-muted/60 h-4 w-3/4 max-w-md rounded"></div>
      <div class="bg-muted/40 mt-1 h-3 w-1/3 max-w-xs rounded"></div>
    </div>
  {/if}
</div>
