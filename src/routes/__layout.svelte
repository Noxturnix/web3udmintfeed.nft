<script lang="ts">
  import "../app.css";
  import "$lib/Fonts.svelte";
</script>

<div class="flex flex-col h-full items-center m-10 md:m-6">
  <slot />
</div>

<style global>
  body {
    @apply bg-[#f9faff];
    font-family: "Open Sans", sans-serif;
  }
</style>
