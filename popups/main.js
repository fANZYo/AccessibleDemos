/* DISCLAIMER!
 * Some of the features of this implementation diverge from the one at:
 * https://www.w3.org/TR/wai-aria-practices/#dialog_modal
 * This is because support for it is not consistent.
 * Notably VoiceOver and TalkBack do not describe the content of the modal
 * when focus is set on the first focusable item even when aria-labelledby is used
 */

const dialog = document.querySelector('.js-dialog');
const dialogOverlay = document.querySelector('.js-dialog-overlay');
const trigger = document.querySelector('.js-trigger');
const cancel = document.querySelector('.js-cancel');
const confirm = document.querySelector('.js-confirm');
const restOfPage = document.querySelector('.js-content');

const openDialog = () => {
	dialogOverlay.removeAttribute('hidden');
	dialog.focus();

	// restOfPage.setAttribute('inert', true); // The inert attribute is poorly supported
	restOfPage.setAttribute('aria-hidden', true); // Does not prevent tabbing to focusable elements but traps VoiceOver's and TalkBack's focus

	document.documentElement.classList.add('noscroll');
};

const closeDialog = () => {
	dialogOverlay.setAttribute('hidden', true);
	dialog.onkeydown = null; // Cleanup keydown event listener
	trigger.focus();

	restOfPage.removeAttribute('aria-hidden');

	document.documentElement.classList.remove('noscroll');
};

trigger.onclick = () => {
	openDialog();

	dialog.onkeydown = (event) => {
		const isTabbing = event.key === 'Tab' && event.shiftKey === false;
		const isShiftTabbing = event.key === 'Tab' && event.shiftKey === true;
		const isFirstFocusable = document.activeElement === cancel;
		const isLastFocusable = document.activeElement === confirm;

		if (event.key === 'Escape') {
			closeDialog();
		} else if (isTabbing && isLastFocusable) { // Trap and wrap focus going forward
			event.preventDefault(); // Prevent default tabbing behaviour conflicting with manual focus setting below
			cancel.focus();
		} else if (isShiftTabbing && isFirstFocusable) { // Trap and wrap focus going backward
			event.preventDefault(); // Prevent default tabbing behaviour conflicting with manual focus setting below
			confirm.focus();
		}
	};
};

confirm.onclick = closeDialog;
cancel.onclick = closeDialog;
