/* Styles */
import './styles/forms.scss';

/* Packages */
import { createContext } from 'react';

/* Scripts */
import {
	ButtonProps,
	ButtonScrollProps,
	DescriptionProps,
	ErrorFieldProps,
	FormProps,
	FormActionsProps,
	FormFieldProps,
	FormFieldDetailsProps,
	InputProps,
	RequiredProps,
} from './scripts/forms-types';
import { forms } from './scripts/forms';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Shares the enclosing FormField's id so grouped radios share a name without a Choice prop */
const ChoiceGroupContext = createContext<string | undefined>(undefined);

export const Button = (props: ButtonProps) => {
	const { children, className: propClassName, hideLabel = false, label, type = 'button', variant = 'primary', ...rest } = props;
	const buttonClass = variant != 'unstyled' && variant != 'link' ? 'button ' : '';
	const variantClass = variant == 'link' ? `button-${variant} button-unstyled a` : `button-${variant}`;
	const disabledClass = rest?.disabled ? ' button-disabled' : '';
	const className = forms.build.className(`${buttonClass}${variantClass}${disabledClass} pointer`, propClassName);

	return (
		<button className={className} type={type} aria-label={hideLabel ? label : undefined} {...rest}>
			{children}
			{hideLabel ? null : <span className="button-label">{label}</span>}
		</button>
	);
};

export const ButtonScroll = (props: ButtonScrollProps) => {
	const { offset = 0, target, ...rest } = props;
	const { utils } = useAppContext();

	return <Button variant="link" onClick={(e) => utils.scrollTo(e, target, offset)} {...rest} />;
};

export const Form = (props: FormProps) => {
	const { children, className: propClassName, ...rest } = props;
	const className = forms.build.className(`form margin-trim`, propClassName);

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
	const { children, hideLabel, id, label, required } = props;
	const className = forms.build.className(`form-field`, props?.className);
	const isChoice = false;

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

			<div className="form-field-control">
				{isChoice ? <ChoiceGroupContext.Provider value={id}>{children}</ChoiceGroupContext.Provider> : children}
			</div>
		</Tag>
	);
};

export const Input = (props: InputProps) => {
	const { className: propClassName, description = '', error = '', hideLabel = false, id, label, required = false, type = 'text', ...rest } = props;
	const freeformFields = ['email', 'number', 'password', 'search', 'tel', 'text', 'url'];
	const className = forms.build.className(`input input-${type}${freeformFields.includes(type) ? ' input-freeform' : ''}`, propClassName);
	const { descriptionId, errorId } = forms.get.ids({ description, error, id });

	// Form field attributes
	const formFieldAttributes = forms.build.formFieldAttributes({ hideLabel, id, label, required });

	// Input attributes
	const inputAttributes = forms.build.fieldAttributes(id, className, descriptionId, error, errorId, required);

	return (
		<FormField {...formFieldAttributes}>
			<input {...inputAttributes} type={type} {...rest} />
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
		<div id={id} className="form-error" role="alert">
			{error}
		</div>
	) : null;
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
