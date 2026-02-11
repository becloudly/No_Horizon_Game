export const APP_CONTROL_CHANNEL = 'app:control' as const;

export type AppControlRequest = {
	type: 'app/quit';
};

export type AppControlResponse =
	| {
			ok: true;
		}
	| {
			ok: false;
			error: string;
		};
