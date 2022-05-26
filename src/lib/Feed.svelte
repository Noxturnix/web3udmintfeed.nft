<script lang="ts">
  import { onMount } from "svelte";
  import type { IFeed } from "./IFeed";
  import anime from "animejs";

  export let feed: IFeed;

  let explorerUrl =
    feed.blockchain === "polygon" ? "https://polygonscan.com" : "https://etherscan.io";
  let transactionExplorerUrl = explorerUrl + "/tx/" + feed.transactionHash;
  let addressExporerUrl = explorerUrl + "/address/" + feed.owner;
  let unstoppableDomainUrl =
    "https://ud.me/" + encodeURIComponent(feed.uri);
  let shortAddr = (addr: string) => addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  let randomElementId = "feed-" + Math.random().toString(36).substring(2);
  let feedElement: HTMLAnchorElement;

  onMount(async () => {
    anime({
      targets: "#" + randomElementId,
      translateY: ["1.5rem", 0],
      opacity: [0, 1],
      easing: "easeOutQuad",
      duration: 400,
      complete: () => {
        feedElement.onmouseenter = () => {
          anime.remove(feedElement);
          anime({
            targets: "#" + randomElementId,
            scale: 1.1,
            easing: "easeOutQuad",
            duration: 150
          });
        };

        feedElement.onmouseleave = () => {
          anime.remove(feedElement);
          anime({
            targets: "#" + randomElementId,
            scale: 1,
            easing: "easeOutQuad",
            duration: 100
          });
        };
      }
    });

    setTimeout(() => {
      feedElement.style.transform = "scale(1)";
      feedElement.onmouseenter = () => {};
      feedElement.onmouseleave = () => {};

      anime({
        targets: "#" + randomElementId,
        opacity: [1, 0],
        easing: "easeInQuad",
        duration: 600
      });

      setTimeout(() => {
        feedElement.remove();
      }, 600);
    }, 60e3);
  });
</script>

<a
  bind:this={feedElement}
  id={randomElementId}
  class="block bg-white border border-gray-400 rounded-lg py-1 px-4 mb-2 shadow shadow-md shadow-light-400 text-center"
  href={transactionExplorerUrl}
  target="_blank"
>
  <span
    ><a
      class="font-semibold hover:underline"
      title={feed.owner}
      href={addressExporerUrl}
      target="_blank">{feed.ownerName || shortAddr(feed.owner)}</a
    >
    minted
    <a class="font-semibold hover:underline" href={unstoppableDomainUrl} target="_blank"
      >{feed.uri}</a
    ></span
  >
</a>
