/**
 * Save game management
 */

export const hasSaveGame = async (): Promise<boolean> => {
	if (window.electronAPI) {
		try {
			return await window.electronAPI.hasSaveGame();
		} catch (err) {
			console.error('Failed to check save game:', err);
			return false;
		}
	}
	return false;
};
