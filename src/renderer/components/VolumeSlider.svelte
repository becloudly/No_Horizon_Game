<script lang="ts">
	import { settings } from '../lib/settings.svelte';
	
	let isDragging = false;
	let localVolume = $settings.volume;
	
	$: localVolume = $settings.volume;
	
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		localVolume = parseInt(target.value, 10);
	}
	
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value, 10);
		settings.setVolume(value);
	}
</script>

<div class="volume-slider-container relative">
	<input 
		type="range" 
		min="0" 
		max="100" 
		value={localVolume}
		on:input={handleInput}
		on:change={handleChange}
		class="volume-slider w-full h-2 bg-white/20 appearance-none cursor-pointer transition-all duration-300"
		style="--value: {localVolume}%"
	/>
	<div 
		class="volume-track-fill absolute top-1/2 -translate-y-1/2 left-0 h-2 bg-gradient-to-r from-white/60 to-white/90 pointer-events-none transition-all duration-150" 
		style="width: {localVolume}%"
	></div>
</div>
