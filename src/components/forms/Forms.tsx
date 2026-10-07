/* Styles */
import './styles/forms.scss';

/* Packages */
import { useRef, useState } from 'react';
import type { InputEvent } from 'react';

/* Scripts */
import type {
	ButtonProps,
	ButtonScrollProps,
	DescriptionProps,
	ErrorFieldProps,
	FieldCloseProps,
	FormProps,
	FormActionsProps,
	FormFieldProps,
	FormFieldDetailsProps,
	InputProps,
	RequiredProps,
} from './scripts/forms-types';
import { forms } from './scripts/forms';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { Alert } from '@/components/alert/Alert';
import { Icon } from '@/components/icons/Icons';

export const Button = (props: ButtonProps) => {
	const { children, className: propClassName, hideLabel = false, label, type = 'button', variant = 'primary', ...rest } = props;
	const buttonClass = variant != 'unstyled' && variant != 'link' ? 'button ' : '';
	const variantClass = variant == 'link' ? `button-${variant} button-unstyled a` : `button-${variant}`;
	const className = forms.build.className(`${buttonClass}${variantClass}`, propClassName, rest?.disabled, true);

	return (
		<button className={className} type={type} aria-label={hideLabel ? label : undefined} {...rest}>
			{children}
			{hideLabel ? null : <span className="button-label">{label}</span>}
		</button>
	);
};

export const ButtonScroll = (props: ButtonScrollProps) => {
	const { offset = 0, target, ...rest } = props;
	const { utilsBrowser } = useAppContext();

	return <Button variant={'link'} onClick={(e) => utilsBrowser.scrollTo(e, target, offset)} {...rest} />;
};

export const Form = (props: FormProps) => {
	const { children, className: propClassName, hasMarginTrim = true, ...rest } = props;
	const formClass = hasMarginTrim ? `form margin-trim` : `form`;
	const className = forms.build.className(formClass, propClassName);

	return (
		<form className={className} {...rest}>
			{children}
		</form>
	);
};

export const FormActions = (props: FormActionsProps) => {
	const { children, className: propClassName } = props;
	const className = forms.build.className(`form-actions`, propClassName);

	return <div className={className}>{children}</div>;
};

export const FormField = (props: FormFieldProps) => {
	const { children, hideLabel, id, isChoice = false, label, required } = props;
	const className = forms.build.className(`form-field`, props?.className);

	// Create elements for form field
	const Tag = isChoice ? 'fieldset' : 'div';
	const Label = isChoice ? 'span' : 'label';

	// Determine attributes for label
	const labelAttributes = {
		className: `label${!hideLabel && !isChoice ? ' pointer' : ''}${hideLabel ? ' sr-only' : ''}`,
		htmlFor: isChoice ? undefined : id,
	};

	return (
		<Tag className={className}>
			{isChoice ? <legend className="sr-only">{label}</legend> : null}

			{hideLabel ? (
				isChoice ? null : (
					<Label {...labelAttributes}>{label}</Label>
				)
			) : (
				<div className="form-field-label">
					<Label {...labelAttributes} aria-hidden={isChoice ? 'true' : undefined}>
						{label}
						<Required isRequired={required ?? false} />
					</Label>
				</div>
			)}

			<div className="form-field-control" data-group-id={isChoice ? id : null}>
				{children}
			</div>
		</Tag>
	);
};

export const Input = (props: InputProps) => {
	const {
		className: propClassName,
		description = '',
		error = '',
		hasClose = false,
		hideLabel = false,
		id,
		label,
		required = false,
		type = 'text',
		...rest
	} = props;
	const freeformFields = ['email', 'number', 'password', 'search', 'tel', 'text', 'url'];
	const inputClass = `input input-${type}${freeformFields.includes(type) ? ' input-freeform' : ''}`;
	const className = forms.build.className(inputClass, propClassName, rest?.disabled);
	const { descriptionId, errorId } = forms.get.ids({ description, error, id });

	// Form field attributes
	const formFieldAttributes = forms.build.formFieldAttributes({ hideLabel, id, label, required });

	// Input attributes
	const inputAttributes = forms.build.fieldAttributes(id, className, descriptionId, error, errorId, required);

	return (
		<FormField {...formFieldAttributes}>
			<FieldClose defaultValue={rest.defaultValue} hasClose={hasClose} value={rest.value}>
				<input {...inputAttributes} type={type} {...rest} />
			</FieldClose>
			<FormFieldDetails description={description} descriptionId={descriptionId} error={error} errorId={errorId} />
		</FormField>
	);
};

/* Components for forms only; not exported */
const Description = (props: DescriptionProps) => {
	const { description, id } = props;

	return description ? (
		<div id={id} className="form-description">
			{description}
		</div>
	) : null;
};

const ErrorField = (props: ErrorFieldProps) => {
	const { error, id } = props;

	return error ? (
		<Alert id={id} type={'warning'}>
			{error}
		</Alert>
	) : null;
};

const FieldClose = (props: FieldCloseProps) => {
	const { children, defaultValue, hasClose, value } = props;
	const fieldRef = useRef<HTMLDivElement>(null);
	const [hasInput, setHasInput] = useState(forms.clearable.hasValue(defaultValue));

	// Show the clear button while the field has a value
	// Note: controlled fields follow their value prop, so changes made outside the field (e.g. a reset) update the button too
	const isActive = value !== undefined ? forms.clearable.hasValue(value) : hasInput;

	// Track the value of uncontrolled fields as the user types
	const handleInput = (e: InputEvent<HTMLDivElement>) => {
		const field = e.target as HTMLInputElement | HTMLTextAreaElement;
		setHasInput(forms.clearable.hasValue(field.value));
	};

	// Clear the field and return focus to it
	const clearField = () => {
		const field = fieldRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>('.input, .textarea');
		if (!field) return;

		forms.clearable.clear(field);
		field.focus();
	};

	// Wrap the field with a clear button
	// Note: only the field and button are wrapped, so a description or error below can't push the button out of place
	return hasClose ? (
		<div className="form-field-close" ref={fieldRef} onInput={handleInput}>
			{children}
			<Button
				className={`button-close${isActive ? ' button-active' : ''}`}
				hideLabel={true}
				label={'Clear'}
				onClick={clearField}
				type={'button'}
				variant={'unstyled'}
			>
				<Icon id={'x'} />
			</Button>
		</div>
	) : (
		children
	);
};

const FormFieldDetails = (props: FormFieldDetailsProps) => {
	const { description, descriptionId, error, errorId } = props;

	return (
		<>
			<Description description={description} id={descriptionId} />
			<ErrorField error={error} id={errorId} />
		</>
	);
};

const Required = (props: RequiredProps) => {
	const { isRequired } = props;

	return isRequired ? (
		<span className="form-required" aria-hidden="true">
			*
		</span>
	) : null;
};
