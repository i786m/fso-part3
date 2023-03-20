import React from 'react';

const Notification = ({ message }) => {
  if (!message) return null;
  return message.includes('Updating')||message.includes('validation failed')?
  <div className='error'>{message}</div> :
  <div className="success">{message}</div>
};

export default Notification;
