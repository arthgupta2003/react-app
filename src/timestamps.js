import React from 'react';

function TimestampInput({ startTime, endTime, onStartTimeChange, onEndTimeChange }) {
  const handleStartTimeChange = (e) => {
    onStartTimeChange(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    onEndTimeChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    // You can perform further processing or pass the timestamps to other components
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Time (HH:MM:SS):
        <input
          type="text"
          pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]"
          placeholder="HH:MM:SS"
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </label>
      <br />
      <label>
        End Time (HH:MM:SS):
        <input
          type="text"
          pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]"
          placeholder="HH:MM:SS"
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </label>
      <br />
    </form>
  );
}

export default TimestampInput;
