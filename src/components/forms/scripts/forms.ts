/* Packages */
import type { ReactNode } from 'react';

export const forms = {
	build: {
		className: (classes: string, className?: string, disabled?: boolean, pointer?: boolean, srOnly?: boolean) => {
			// Create class array
			const classList = [classes];

			// If custom class name, add that first
			if (className) classList.unshift(className);

			// Add helper classes
			if (disabled) classList.push('disabled');
			if (pointer) classList.push('pointer');
			if (srOnly) classList.push('sr-only');

			// Create className value for form fields
			return classList.join(' ');
		},
		fieldAttributes: (id: string, className: string, descriptionId?: string, error?: ReactNode, errorId?: string, required?: boolean) => {
			// Set common attributes for form fields
			const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
			return {
				id: id,
				className: className,
				name: id,
				required: required,
				'aria-required': required || undefined,
				'aria-invalid': !!error || undefined,
				'aria-describedby': describedBy,
			};
		},
		formFieldAttributes: (props: { hideLabel: boolean; id: string; label: string; required: boolean }) => {
			// Build common form field props
			const { hideLabel, id, label, required } = props;
			return {
				hideLabel: hideLabel,
				id: id,
				label: label,
				required: required,
			};
		},
	},
	clearable: {
		hasValue: (value?: string | number | readonly string[]) => {
			// Check whether a field value isn't empty (0 counts as a value)
			return value !== undefined && String(value) !== '';
		},
		clear: (field: HTMLInputElement | HTMLTextAreaElement) => {
			// Set the value with the native setter, since React ignores direct value changes on controlled fields
			const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
			Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(field, '');

			// Fire input so onChange / onInput handlers (and the clear button state) update
			field.dispatchEvent(new Event('input', { bubbles: true }));
		},
	},
	get: {
		ids: (props: { description: string; error: ReactNode; id: string }) => {
			// Get ids for form field
			const { description, error, id } = props;
			const descriptionId = description ? `${id}-description` : undefined;
			const errorId = error ? `${id}-error` : undefined;
			return { descriptionId, errorId };
		},
	},
};
