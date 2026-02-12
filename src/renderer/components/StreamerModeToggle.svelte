<script lang="ts">
	import { settings } from '../lib/settings.svelte';
	
	export let tooltip: string;
	
	let showTooltip = false;
	
	$: enabled = $settings.streamerMode;
	
	function toggle() {
		settings.setStreamerMode(!enabled);
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}
</script>

<div class="relative inline-block">
	<!-- Label with tooltip -->
	<button
		type="button"
		class="setting-label font-mono text-lg tracking-widest text-white/80 mb-2 block cursor-help text-left"
		on:mouseenter={() => showTooltip = true}
		on:mouseleave={() => showTooltip = false}
		on:focus={() => showTooltip = true}
		on:blur={() => showTooltip = false}
		aria-describedby="streamer-mode-tooltip"
	>
		<!-- Tooltip -->
		<div 
			id="streamer-mode-tooltip"
			role="tooltip"
			class="tooltip absolute left-0 top-full mt-4 w-80 bg-black/95 border border-white/40 p-4 font-mono text-sm text-white/80 leading-relaxed shadow-[0_0_20px_rgba(255,255,255,0.2)] z-50 transition-opacity duration-300"
			class:opacity-0={!showTooltip}
			class:opacity-100={showTooltip}
			class:pointer-events-none={!showTooltip}
			class:pointer-events-auto={showTooltip}
		>
			{tooltip}
		</div>
	</button>
	
	<!-- Toggle Switch -->
	<button
		type="button"
		on:click={toggle}
		on:keydown={handleKeydown}
		class="streamer-toggle relative inline-block w-20 h-10 transition-all duration-300 cursor-pointer"
		role="switch"
		aria-checked={enabled}
		aria-label="Toggle streamer mode"
		tabindex="0"
	>
		<div 
			class="toggle-track absolute inset-0 border transition-all duration-300"
			style="
				background-color: {enabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
				border-color: {enabled ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)'};
			"
		></div>
		<div 
			class="toggle-thumb absolute top-1 left-1 w-8 h-8 transition-all duration-300"
			class:animate-pulse-glow={enabled}
			style="
				transform: translateX({enabled ? '40px' : '0'});
				background-color: {enabled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)'};
				box-shadow: {enabled ? '0 0 16px rgba(255, 255, 255, 0.8)' : '0 0 8px rgba(255, 255, 255, 0.3)'};
			"
		></div>
		<div 
			class="toggle-glow absolute inset-0 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
			style="opacity: {enabled ? '1' : '0'}"
		></div>
	</button>
</div>

<style>
	.animate-pulse-glow {
		animation: pulse-glow 2s ease-in-out infinite;
	}
	
	@keyframes pulse-glow {
		0%, 100% {
			box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
		}
		50% {
			box-shadow: 0 0 24px rgba(255, 255, 255, 1);
		}
	}
</style>
