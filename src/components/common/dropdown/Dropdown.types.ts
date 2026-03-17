export interface IDropdownOption {
  label: string;
  value: string;
}

export interface IDropdownProps {
  options: IDropdownOption[];
  value: string;
  label?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  onChange: (value: string) => void;
}
