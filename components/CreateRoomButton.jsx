import React, { useState } from 'react';
import Button from '@custom/shared/components/Button';
import Well from '@custom/shared/components/Well';
import axios from 'axios';

export function CreateRoomButton({
  isConfigured,
  isValidRoom,
  setRoom,
  setExpiry,
  roomName
}) {
  const [isError, setIsError] = useState(false);

  /**
   * Send a request to create a Daily room server-side via Next API routes, then set the returned url in local state to trigger Daily iframe creation in <Call />
   */
  const createRoom = async () => {

    const exp = Math.round(Date.now() / 1000) + 60 * 30;
    // const options = {
    //   // name: 'myuniqueRoom',
    //   properties: {
    //     exp,
    //   },
    // };

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          enable_prejoin_ui: true,
          enable_network_ui: true,
          enable_screenshare: true,
          enable_chat: true,
          exp: Math.round(Date.now() / 1000) + 300,
          eject_at_room_exp: true,
        },
      }),
    };

    try {
      const res = await axios.post('/api/room', {options});
      // await fetch('/api/room', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(options)
      // });
      
console.log(res.data)
      const resJson = await res.data  //.json();
      
      setExpiry(resJson.config?.exp);
      setRoom(resJson.url);
    } catch (e) {
      setIsError(true);
    }
  };
  return (
    <>
      {!isConfigured && (
        <Well variant="error">
          You must configure env variables to create rooms (see README
          instructions).
        </Well>
      )}
      {isError && (
        <Well variant="error">Error creating the room. Please try again.</Well>
      )}
      <Button onClick={createRoom} disabled={isValidRoom}>
        Create room and start
      </Button>
    </>
  );
}

export default CreateRoomButton;
