import React, { useState, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import withPropTypes from 'with-prop-types';
import styled, { css, keyframes } from 'styled-components';

const Temp = styled.div`
  width: 200px;
  height: 100px;
  background: blue;
`;

const Formatter = styled.div`
  position: fixed;
  right: ${props =>
    props.pos === 'r' ? '20px' : props.pos === 'm' ? '0' : 'initial'};
  left: ${props =>
    props.pos === 'l' ? '20px' : props.pos === 'm' ? '0' : 'initial'};
  ${props =>
    props.pos === 'm' &&
    css`
      margin: auto auto;
      width: fit-content;
    `}
	top: 20px;
	/* opacity: ${props => (props.shouldBeVisible ? '1.0' : '0.0')}; */
	/* transition: opacity 1s ease; */
	z-index: 100;
	& > * {
		margin-bottom: 10px
	}
	& > *:last-child {
		margin-bottom: 0;
	}
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

const Animator = styled.div`
  animation: ${props =>
      props.pos === 'l'
        ? leftToRightAnimation
        : props.pos === 'r'
        ? rightToLeftAnimation
        : topToBottomAnimation}
    0.3s ease;
`;

const Context = createContext();
const { Provider: P } = Context;

export const Provider = withPropTypes(
  {
    position: PropTypes.oneOf(['l', 'm', 'r']),
  },
  {
    position: 'm',
  }
)(({ children, position }) => {
  const [notifications, setNotifications] = useState([]);
  return (
    <P
      value={{
        setNotifications,
      }}
    >
      {children}
      <Formatter pos={position}>
        {notifications.map(({ id, component: Notification }) => {
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
              <Notification />
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
  const addNotification = () => {
    const notificationId = `timed-notification-${String(new Date().getTime())}`;
    setTimeout(() => removeNotification(notificationId), 5000);
    setNotifications(prevNotifications =>
      prevNotifications.concat([
        {
          id: notificationId,
          component: Temp,
        },
      ])
    );
  };
  return {
    notify: addNotification,
  };
};
