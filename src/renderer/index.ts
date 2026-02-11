// Renderer process entry point
console.log('Renderer process initialized');

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let rafId = 0;

const setVars = (x: number, y: number): void => {
	root.style.setProperty('--mouse-x', x.toFixed(4));
	root.style.setProperty('--mouse-y', y.toFixed(4));
};

const tick = (): void => {
	const ease = 0.08;
	currentX += (targetX - currentX) * ease;
	currentY += (targetY - currentY) * ease;
	setVars(currentX, currentY);
	rafId = window.requestAnimationFrame(tick);
};

const handleMove = (event: MouseEvent): void => {
	const x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
	const y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
	targetX = Math.max(-1, Math.min(1, x * 2));
	targetY = Math.max(-1, Math.min(1, y * 2));
};

const handleLeave = (): void => {
	targetX = 0;
	targetY = 0;
};

if (prefersReducedMotion.matches) {
	setVars(0, 0);
} else {
	window.addEventListener('mousemove', handleMove, { passive: true });
	window.addEventListener('mouseleave', handleLeave, { passive: true });
	rafId = window.requestAnimationFrame(tick);
}

prefersReducedMotion.addEventListener('change', (event) => {
	if (event.matches) {
		window.removeEventListener('mousemove', handleMove);
		window.removeEventListener('mouseleave', handleLeave);
		if (rafId) {
			window.cancelAnimationFrame(rafId);
		}
		setVars(0, 0);
	} else {
		window.addEventListener('mousemove', handleMove, { passive: true });
		window.addEventListener('mouseleave', handleLeave, { passive: true });
		rafId = window.requestAnimationFrame(tick);
	}
});
