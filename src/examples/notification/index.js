import React from 'react';
import styled from 'styled-components';
import useNotification from '../../components/notification';

const Card = styled.div`
  border-radius: 5px;
  background: ${props => {
    if (props.type === 'success') {
      return 'palegreen';
    } else if (props.type === 'warning') {
      return 'palegoldenrod';
    } else if (props.type === 'error') {
      return 'palevioletred';
    } else {
      return '#fafafa';
    }
  }};
  width: 200px;
  box-sizing: border-box;
  padding: 10px;
  & p {
    margin: 0;
    font-family: 'Karla';
  }
  margin: 10px;
`;

export const Notification = ({ type, message }) => {
  return (
    <Card type={type}>
      <p>{message}</p>
    </Card>
  );
};

export default () => {
  const { notify } = useNotification();
  return (
    <div>
      <button
        onClick={() =>
          notify({
            props: {
              type: 'success',
              message: 'This notification is a success message',
            },
          })
        }
      >
        Notification 1
      </button>
      <button
        onClick={() =>
          notify({
            props: {
              type: 'warning',
              message: 'This notification is a warning message',
            },
          })
        }
      >
        Notification 2
      </button>
      <button
        onClick={() =>
          notify({
            props: {
              type: 'error',
              message: 'This notification is an error message',
            },
          })
        }
      >
        Notification 3
      </button>
      <button
        onClick={() =>
          notify({
            props: {
              message: 'This notification is a regular message',
            },
          })
        }
      >
        Notification 4
      </button>
    </div>
  );
};
