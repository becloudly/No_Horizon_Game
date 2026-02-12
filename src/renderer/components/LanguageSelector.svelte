<script lang="ts">
	import type { Language } from '../locales';
	
	export let currentLang: Language;
	export let onChange: (lang: Language) => void;
	
	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onChange(target.value as Language);
	}
</script>

<select 
	value={currentLang}
	on:change={handleChange}
	class="language-dropdown w-full bg-black/60 border border-white/30 text-white/90 px-6 py-3 font-mono text-base tracking-wide transition-all duration-300 hover:border-white/50 focus:border-white focus:outline-none focus:shadow-[0_0_12px_rgba(255,255,255,0.3)]"
>
	<option value="en">English</option>
	<option value="de">Deutsch</option>
</select>
