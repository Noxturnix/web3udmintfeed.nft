<script lang="ts">
  import { onMount } from "svelte";
  import type { BigNumber, Event } from "ethers";
  import {
    polygonProvider,
    polygonContractAddress,
    polygonRegistryContract,
    polygonResolverContract,
    ethereumProvider,
    ethereumRegistryContract,
    ethereumResolverContract
  } from "$lib/web3connection";
  import Feed from "$lib/Feed.svelte";
  import { lookupDomainFromTokenId } from "$lib/udTool";

  let feedEverLoaded = false;
  let polygonBlockNumber: number;
  let ethereumBlockNumber: number;
  let mintFeed: HTMLDivElement;
  let knownDomainId: string[] = [];

  onMount(async () => {
    const handleNewUri = async (tokenId: BigNumber, uri: string, event: Event) => {
      if (knownDomainId.includes(tokenId.toString())) {
        return;
      }

      let blockchain: "ethereum" | "polygon" =
        event.address === polygonContractAddress ? "polygon" : "ethereum";
      let registryContract =
        blockchain === "polygon" ? polygonRegistryContract : ethereumRegistryContract;
      let resolverAddress: string = await registryContract.resolverOf(tokenId);
      let resolverContract =
        blockchain === "polygon"
          ? polygonResolverContract(resolverAddress)
          : ethereumResolverContract(resolverAddress);

      let domainOwnerAddress: string;
      let domainOwnerFetchRetryCount = 0;
      while (true) {
        if (domainOwnerFetchRetryCount >= 60) {
          console.error("Failed to fetch domain owner of", uri);
          return;
        }
        try {
          domainOwnerAddress = await resolverContract.ownerOf(tokenId);
          break;
        } catch (error) {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
        }
        domainOwnerFetchRetryCount++;
      }

      let domainOwnerReverseResolutionTokenId = await resolverContract.reverseOf(
        domainOwnerAddress
      );
      let domainOwnerName = domainOwnerReverseResolutionTokenId.eq(0)
        ? null
        : await lookupDomainFromTokenId(domainOwnerReverseResolutionTokenId);
      domainOwnerName =
        domainOwnerName || (await ethereumProvider.lookupAddress(domainOwnerAddress));

      knownDomainId.push(tokenId.toString());
      knownDomainId = knownDomainId.slice(-100);

      feedEverLoaded = true;

      new Feed({
        target: mintFeed,
        props: {
          feed: {
            tokenId: tokenId,
            uri: uri,
            blockchain,
            owner: domainOwnerAddress,
            ownerName: domainOwnerName,
            transactionHash: event.transactionHash
          }
        }
      });
    };

    polygonProvider.getBlockNumber().then((blockNumber) => {
      polygonBlockNumber = blockNumber;
    });
    polygonProvider.on("block", (blockNumber) => {
      polygonBlockNumber = blockNumber;
    });
    polygonRegistryContract.on("NewURI", handleNewUri);

    ethereumProvider.getBlockNumber().then((blockNumber) => {
      ethereumBlockNumber = blockNumber;
    });
    ethereumProvider.on("block", (blockNumber) => {
      ethereumBlockNumber = blockNumber;
    });
    ethereumRegistryContract.on("NewURI", handleNewUri);
  });
</script>

<div class="mt-4 md:m-2 flex flex-col items-center text-center">
  <h1>Unstoppable Domains mint feed</h1>
  <span>See newly minted domain names in real time</span>
</div>
<div class="mt-4 md:m-2 flex flex-col items-center text-sm text-center">
  <span
    >Current Polygon block number: <span class="font-semibold"
      >{polygonBlockNumber || "Loading..."}</span
    ></span
  >
  <span
    >Current Ethereum block number: <span class="font-semibold"
      >{ethereumBlockNumber || "Loading..."}</span
    ></span
  >
</div>
<div bind:this={mintFeed} class="mt-4 md:m-2 flex flex-col items-center text-center">
  {#if !feedEverLoaded}
    <span class="text-[#5e5e6e]">Waiting for new domains...</span>
  {/if}
</div>
<div class="fixed bottom-2 md:bottom-[0.1rem] text-center">
  <span
    >Made by <a href="https://noxt.us/" target="_blank" class="underline">Noxturnix</a> |
    <a href="https://github.com/Noxturnix/web3udmintfeed.nft" target="_blank" class="underline"
      >Source code</a
    ></span
  >
</div>

<style>
  h1 {
    @apply text-2xl;
    @apply font-bold;
  }
</style>
