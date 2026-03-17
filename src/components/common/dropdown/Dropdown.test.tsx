import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './Dropdown';
import type { IDropdownOption } from './Dropdown.types';

const options: IDropdownOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const defaultProps = {
  options,
  value: '',
  onChange: jest.fn(),
};

describe('Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with a label when provided', () => {
      render(<Dropdown {...defaultProps} label="Fruit" />);
      expect(screen.getByLabelText('Fruit')).toBeInTheDocument();
    });

    it('does not render a label when not provided', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('shows placeholder when no value is selected', () => {
      render(<Dropdown {...defaultProps} placeholder="Pick a fruit" />);
      expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
    });

    it('shows default placeholder when none is provided', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByText('Select…')).toBeInTheDocument();
    });

    it('shows the selected option label when a value is set', () => {
      render(<Dropdown {...defaultProps} value="banana" />);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('renders error message when error prop is provided', () => {
      render(<Dropdown {...defaultProps} error="Required field" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    });

    it('does not render error message when error prop is absent', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('applies custom className to the container', () => {
      const { container } = render(<Dropdown {...defaultProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('uses provided id on the trigger button', () => {
      render(<Dropdown {...defaultProps} id="my-dropdown" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-dropdown');
    });
  });

  describe('ARIA attributes', () => {
    it('sets aria-expanded to false when closed', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-haspopup to listbox', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('sets aria-invalid when error is provided', () => {
      render(<Dropdown {...defaultProps} error="Oops" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when there is no error', () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('sets aria-expanded to true when open', async () => {
      render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-controls pointing to the listbox id', async () => {
      render(<Dropdown {...defaultProps} id="dd" />);
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-controls', 'dd-listbox');
      expect(screen.getByRole('listbox')).toHaveAttribute('id', 'dd-listbox');
    });
  });

  describe('open / close behaviour', () => {
    it('opens the listbox when the trigger is clicked', async () => {
      render(<Dropdown {...defaultProps} />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes the listbox when the trigger is clicked again', async () => {
      render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('renders all options when open', async () => {
      render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      const optionEls = screen.getAllByRole('option');
      expect(optionEls).toHaveLength(options.length);
      optionEls.forEach((el, i) => expect(el).toHaveTextContent(options[i].label));
    });

    it('closes when clicking outside the dropdown', async () => {
      render(
        <div>
          <Dropdown {...defaultProps} />
          <button>Outside</button>
        </div>
      );
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.mouseDown(screen.getByText('Outside'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('calls onChange with the selected value when an option is clicked', async () => {
      const onChange = jest.fn();
      render(<Dropdown {...defaultProps} onChange={onChange} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Banana'));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('closes the listbox after an option is selected', async () => {
      render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Apple'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables the trigger button', () => {
      render(<Dropdown {...defaultProps} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('does not open the listbox when disabled', async () => {
      render(<Dropdown {...defaultProps} disabled />);
      await userEvent.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('applies dropdown--disabled class when disabled', () => {
      const { container } = render(<Dropdown {...defaultProps} disabled />);
      expect(container.firstChild).toHaveClass('dropdown--disabled');
    });
  });

  describe('CSS modifier classes', () => {
    it('applies dropdown--open class when open', async () => {
      const { container } = render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      expect(container.firstChild).toHaveClass('dropdown--open');
    });

    it('removes dropdown--open class when closed', async () => {
      const { container } = render(<Dropdown {...defaultProps} />);
      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByRole('combobox'));
      expect(container.firstChild).not.toHaveClass('dropdown--open');
    });

    it('applies dropdown--error class when error is provided', () => {
      const { container } = render(<Dropdown {...defaultProps} error="Bad" />);
      expect(container.firstChild).toHaveClass('dropdown--error');
    });
  });
});
