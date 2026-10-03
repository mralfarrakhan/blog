<script lang="ts">
  import { getRandomQuote, type Quote } from "$lib/quotes";
  import { onMount } from "svelte";

  let quote = $state<Quote>();
  let loading = $state(true);

  onMount(async () => {
    try {
      const response = await fetch("/api/data/quote.json");
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
  class="my-12 rounded-lg border border-border/70 bg-card p-6 sm:p-7 not-prose"
>
  {#if quote}
    <div class="flex flex-col items-center text-center space-y-3">
      <svg
        class="w-6 h-6 text-muted-foreground/35"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path
          d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
        />
      </svg>
      <blockquote class="text-base sm:text-lg italic text-foreground/90 leading-relaxed font-sans text-pretty max-w-xl">
        "{quote.text}"
      </blockquote>
      <div class="text-xs font-mono text-muted-foreground pt-1">
        <span class="font-medium text-foreground/80">{quote.author}</span>
        {#if quote.source}
          <span class="text-muted-foreground/70 ml-1.5">&mdash; {quote.source}</span>
        {/if}
      </div>
    </div>
  {:else if loading}
    <div class="flex flex-col items-center space-y-3 animate-pulse" aria-hidden="true">
      <div class="w-6 h-6 rounded bg-muted/60"></div>
      <div class="h-4 w-3/4 max-w-md rounded bg-muted/60"></div>
      <div class="h-3 w-1/3 max-w-xs rounded bg-muted/40 mt-1"></div>
    </div>
  {/if}
</div>
