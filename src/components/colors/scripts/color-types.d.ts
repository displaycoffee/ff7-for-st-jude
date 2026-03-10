/* Type definitions */
type Colors = {
	showButton: boolean;
};

type ColorsField = {
	colors: ObjectPrimitiveType;
	id: number;
	label: string;
	setColors: Dispatch<SetStateAction>;
};

/* Export prop types */
export type ColorsProps = Colors;

export type ColorsFieldProps = ColorsField;
