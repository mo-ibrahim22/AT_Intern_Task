export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'outline'
    | 'ghost'
    | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IconPosition = 'left' | 'right' | 'center' | 'between';

export interface ButtonModel {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    iconPosition?: IconPosition;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
}