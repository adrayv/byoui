import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import withPropTypes from 'with-prop-types';
import './index.css';

const Context = createContext();
const { Provider: P } = Context;

const Formatter = ({ zIndex, position, children }) => {
  let classList = ['adrayv-ui-notify'];
  if (position.includes('r')) {
    classList.push('adrayv-ui-notify-align-right');
  } else if (position.includes('l')) {
    classList.push('adrayv-ui-notify-align-left');
  } else {
    classList.push('adrayv-ui-notify-align-center');
  }

  if (position.includes('b')) {
    classList.push('adrayv-ui-notify-align-bottom');
  } else {
    classList.push('adrayv-ui-notify-align-top');
  }
  return (
    <div className={classList.join(' ')} style={{ zIndex }}>
      {children}
    </div>
  );
};

const Animator = ({ position, children }) => {
  let classList = [];
  if (position.includes('l')) {
    classList.push('adrayv-ui-notify-animation-left-right');
  } else if (position.includes('r')) {
    classList.push('adrayv-ui-notify-animation-right-left');
  } else if (position.includes('b')) {
    classList.push('adrayv-ui-notify-animation-bottom-top');
  } else {
    classList.push('adrayv-ui-notify-animation-top-bottom');
  }
  return <div className={classList.join(' ')}>{children}</div>;
};

export const Provider = withPropTypes(
  {
    /* position where the notification component will appear */
    position: PropTypes.oneOf(['rl', 'tm', 'tr', 'bl', 'bm', 'br']),
    zIndex: PropTypes.number,
    component: PropTypes.element.isRequired,
  },
  {
    position: 'tr',
    zIndex: 50,
  }
)(({ children, position, component: Notification, zIndex }) => {
  const [notifications, setNotifications] = useState([]);
  return (
    <P
      value={{
        setNotifications,
      }}
    >
      {children}
      <Formatter zIndex={zIndex} position={position}>
        {notifications.map(({ id, componentProps }) => {
          return (
            <Animator
              id={id}
              position={position}
              onClick={() =>
                setNotifications(prevNotifications =>
                  prevNotifications.filter(
                    ({ id: notificationId }) => notificationId !== id
                  )
                )
              }
            >
              <Notification {...componentProps} />
            </Animator>
          );
        })}
      </Formatter>
    </P>
  );
});

export default () => {
  const { setNotifications } = useContext(Context);
  const removeNotification = notificationId => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(({ id }) => notificationId !== id)
    );
  };
  const addNotification = (duration = 3000, componentProps = {}) => {
    const notificationId = `adrayv-ui-notification-${String(
      new Date().getTime()
    )}`;
    setTimeout(() => removeNotification(notificationId), duration);
    setNotifications(prevNotifications =>
      prevNotifications.concat([
        {
          id: notificationId,
          componentProps,
        },
      ])
    );
  };
  return {
    notify: ({ duration, props }) => addNotification(duration, props),
  };
};
