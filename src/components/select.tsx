import {FC, MouseEventHandler, ReactNode, useRef, useState} from 'react';
import {SelectOption} from '../types/select.ts';
import {useOutsideClick} from '../utils/use-outside-click.ts';

type SelectProps = {
  options: SelectOption[];
  activeOptionKey: SelectOption['key'];
  children?: ReactNode;
  onSelect?: (option: SelectOption['key']) => void;
};

const optionClasses = 'places__option';
const activeOptionClasses = `${optionClasses} places__option--active`;

export const Select: FC<SelectProps> = ({options, activeOptionKey, children, onSelect}) => {
  const expandRef = useRef<HTMLUListElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useOutsideClick(expandRef, () => setIsExpanded(false));

  const selected = options.find((opt) => opt.key === activeOptionKey);

  const clickHandler: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const selectOptionHandler = (optionKey: SelectOption['key']) => {
    onSelect?.(optionKey);
    setIsExpanded(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">{children}</span>
      <span className="places__sorting-type" tabIndex={0} onClick={clickHandler}>
        {selected?.value}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {isExpanded && (
        <ul ref={expandRef} className="places__options places__options--custom places__options--opened">
          {options.map((option) => (
            <li
              key={option.key}
              className={option.key === activeOptionKey ? activeOptionClasses : optionClasses}
              tabIndex={0}
              onClick={() => selectOptionHandler(option.key)}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
