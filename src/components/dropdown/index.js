import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const StopPropagator = ({ children }) => {
  return (
    <span onClick={e => e && e.stopPropagation && e.stopPropagation()}>
      {children}
    </span>
  );
};

const FlyoutWrap = ({ children, position, zIndex }) => {
  let classList = ['adrayv-ui-flyout'];
  switch (position) {
    case 'bl':
      classList.push('adrayv-ui-flyout-bl');
      break;
    case 'br':
      classList.push('adrayv-ui-flyout-br');
      break;
    case 'tr':
      classList.push('adrayv-ui-flyout-tr');
      break;
    case 'tl':
      classList.push('adrayv-ui-flyout-tl');
      break;
    default:
      classList.push('adrayv-ui-flyout-bl');
  }
  if (position.charAt(0) === 't') {
    classList.push('adrayv-ui-bottom-to-top-animation');
  } else {
    classList.push('adrayv-ui-top-to-bottom-animation');
  }
  return (
    <div className={classList.join(' ')} style={{ zIndex }}>
      <StopPropagator>{children}</StopPropagator>
    </div>
  );
};

const Dropdown = ({ trigger, flyout, flyoutPos, zIndex }) => {
  const [isOpen, setOpenState] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    setTimeout(() => setInstanceKey(new Date().getTime()), 1);
    return () => window.removeEventListener('click', clickListener);
  }, []);

  const open = domEvent => {
    window.addEventListener('click', clickListener);
    setOpenState(true);
    domEvent && domEvent.stopPropagation && domEvent.stopPropagation();
  };
  const close = domEvent => {
    window.removeEventListener('click', clickListener);
    setOpenState(false);
    domEvent && domEvent.stopPropagation && domEvent.stopPropagation();
  };
  const clickListener = domEvent => {
    domEvent && domEvent.stopPropagation && domEvent.stopPropagation();
    const clickingOnSelf = domEvent.target.classList.value.includes(
      `adrayv-ui-dropdown-${instanceKey}`
    );
    if (!clickingOnSelf) {
      close();
    }
  };
  return (
    <div className="adrayv-ui-dropdown-wrap" onClick={isOpen ? close : open}>
      <div
        className={`adrayv-ui-trigger-wrap adrayv-ui-dropdown-${instanceKey}`}
      >
        {trigger}
      </div>
      {isOpen && (
        <FlyoutWrap position={flyoutPos} zIndex={zIndex}>
          {flyout}
        </FlyoutWrap>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  /** React component, that when clicked, reveals the flyout */
  trigger: PropTypes.element.isRequired,
  /** React component, shown on reveal */
  flyout: PropTypes.element.isRequired,
  /** How the flyout should be placed relative to the Menu Button. b - bottom, t - top, l - left, r - right */
  flyoutPos: PropTypes.oneOf(['bl', 'br', 'tl', 'tr']),
  /** Flyout z-index */
  zIndex: PropTypes.number,
};

Dropdown.defaultProps = {
  flyoutPos: 'bl',
  zIndex: 49,
};

export default Dropdown;
