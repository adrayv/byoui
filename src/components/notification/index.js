import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import withPropTypes from 'with-prop-types';
import styled, { css, keyframes } from 'styled-components';

const Temp = styled.div`
  width: 200px;
  height: 100px;
  background: blue;
  margin: 10px;
`;

const Formatter = styled.div`
  position: fixed;
  z-index: 100;
  ${props => {
    if (props.pos.includes('r')) {
      return css`
        right: 0;
      `;
    } else if (props.pos.includes('l')) {
      return css`
        left: 0;
      `;
    } else {
      return css`
        left: 0;
        right: 0;
        margin: 0 auto;
        width: fit-content;
      `;
    }
  }};
  ${props => {
    if (props.pos.includes('b')) {
      return css`
        bottom: 0;
      `;
    } else {
      return css`
        top: 0;
      `;
    }
  }};
`;

const rightToLeftAnimation = keyframes`
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
`;

const leftToRightAnimation = keyframes`
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0px);
    opacity: 1;
  }
`;

const topToBottomAnimation = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const bottomToTopAnimation = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0px);
    opacity: 1;
  }
`;

const Animator = styled.div`
  ${props => {
    if (props.pos.includes('l')) {
      return css`
        animation: ${leftToRightAnimation} 0.3s ease;
      `;
    } else if (props.pos.includes('r')) {
      return css`
        animation: ${rightToLeftAnimation} 0.3s ease;
      `;
    } else if (props.pos.includes('b')) {
      return css`
        animation: ${bottomToTopAnimation} 0.3s ease;
      `;
    } else {
      return css`
        animation: ${topToBottomAnimation} 0.3s ease;
      `;
    }
  }};
`;

const Context = createContext();
const { Provider: P } = Context;

export const Provider = withPropTypes(
  {
    /* position where the notification component will appear */
    position: PropTypes.oneOf(['rl', 'tm', 'tr', 'bl', 'bm', 'br']),
  },
  {
    position: 'bm',
  }
)(({ children, position }) => {
  const [notifications, setNotifications] = useState([]);
  const n = position.includes('b')
    ? notifications.slice().reverse()
    : notifications;
  return (
    <P
      value={{
        setNotifications,
      }}
    >
      {children}
      <Formatter pos={position}>
        {n.map(({ id, component: Notification, componentProps }) => {
          return (
            <Animator
              id={id}
              pos={position}
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
    const notificationId = `timed-notification-${String(new Date().getTime())}`;
    setTimeout(() => removeNotification(notificationId), duration);
    setNotifications(prevNotifications =>
      prevNotifications.concat([
        {
          id: notificationId,
          component: Temp,
          componentProps,
        },
      ])
    );
  };
  return {
    notify: ({ duration, props }) => addNotification(duration, props),
  };
};
