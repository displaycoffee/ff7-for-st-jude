/* Packages */
import { ButtonHTMLAttributes, FormHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/* Shared field concerns for form controls with a label / error / required state */
type Field = {
	className?: string;
	description?: string;
	error?: string;
	hideLabel?: boolean;
	id: string;
	label: string;
	required?: boolean;
};

/* Type definitions */
type Button = {
	children?: ReactNode;
	className?: string;
	hideLabel?: boolean;
	label: string;
	type?: 'button' | 'reset' | 'submit';
	variant?: 'link' | 'primary' | 'secondary' | 'tertiary' | 'unstyled';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'type' | 'variant'>;

type ButtonScroll = Omit<Button, 'onClick' | 'type' | 'variant'> & {
	offset?: number;
	target: string;
};

type Description = {
	description?: string;
	id?: string;
};

type ErrorField = {
	error?: string;
	id?: string;
};

type Form = {
	children: ReactNode;
	className?: string;
} & Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'className'>;

type FormActions = {
	children: ReactNode;
	className?: string;
};

type FormField = {
	children: ReactNode;
	className?: string;
	hideLabel?: boolean;
	id: string;
	label: string;
	required?: boolean;
};

type FormFieldDetails = {
	description?: string;
	descriptionId?: string;
	error?: string;
	errorId?: string;
};

type Input = Field & {
	type?:
		| 'color'
		| 'date'
		| 'datetime-local'
		| 'email'
		| 'file'
		| 'month'
		| 'number'
		| 'password'
		| 'range'
		| 'search'
		| 'tel'
		| 'text'
		| 'time'
		| 'url'
		| 'week';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'className' | 'required' | 'type'>;

type Required = {
	isRequired: boolean;
};

/* Export prop types */
export type ButtonProps = Button;

export type ButtonScrollProps = ButtonScroll;

export type DescriptionProps = Description;

export type ErrorFieldProps = ErrorField;

export type FormProps = Form;

export type FormActionsProps = FormActions;

export type FormFieldProps = FormField;

export type FormFieldDetailsProps = FormFieldDetails;

export type InputProps = Input;

export type RequiredProps = Required;
