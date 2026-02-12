<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { settings } from '../lib/settings.svelte';
	import { getTranslations, getCurrentLanguage, setLanguage, subscribe } from '../lib/i18n';
	import type { Language } from '../locales';
	import LanguageSelector from './LanguageSelector.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import StreamerModeToggle from './StreamerModeToggle.svelte';
	
	export let onBack: () => void;
	
	let t = getTranslations();
	let currentLang = getCurrentLanguage();
	let unsubscribe: (() => void) | null = null;
	
	// Update translations when language changes
	function handleLanguageChange(lang: Language) {
		setLanguage(lang);
		t = getTranslations();
		currentLang = lang;
	}
	
	// Subscribe to language changes
	onMount(() => {
		unsubscribe = subscribe((_lang, translations) => {
			t = translations;
			currentLang = _lang;
		});
	});
	
	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});
</script>

<div class="settings-content absolute inset-0 flex items-center justify-center pt-24 pb-16 px-8 overflow-y-auto">
	<div class="settings-panel max-w-2xl w-full mx-auto space-y-12">
		<!-- Language Setting -->
		<div class="setting-item">
			<label class="setting-label font-mono text-lg tracking-widest text-white/80 mb-3 block">
				{t.settings.language}
			</label>
			<LanguageSelector {currentLang} onChange={handleLanguageChange} />
		</div>

		<!-- Volume Setting -->
		<div class="setting-item">
			<div class="flex justify-between items-center mb-3">
				<label class="setting-label font-mono text-lg tracking-widest text-white/80">
					{t.settings.volume}
				</label>
				<span class="font-mono text-lg text-white/90 min-w-[4rem] text-right">
					{$settings.volume}%
				</span>
			</div>
			<VolumeSlider />
		</div>

		<!-- Streamer Mode Setting -->
		<div class="setting-item">
			<div class="flex justify-between items-center">
				<div class="flex-1">
					<div class="setting-label font-mono text-lg tracking-widest text-white/80 mb-2 block">
						{t.settings.streamerMode}
					</div>
				</div>
				<StreamerModeToggle tooltip={t.settings.streamerModeTooltip} />
			</div>
		</div>
	</div>
</div>
