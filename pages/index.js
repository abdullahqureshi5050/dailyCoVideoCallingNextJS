import React, { useState } from 'react';
import Header from '@custom/shared/components/Header';
import getDemoProps from '@custom/shared/lib/demoProps';
import Call from '../components/Call';
import Home from '../components/Home';

const roomName = "roomNamerwfsdfsfsfsrfsfdf101";

export default function Index({ isConfigured = false }) {
  const [room, setRoom] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [callFrame, setCallFrame] = useState(null);
 console.log("======== rrrrrrrrrrrrrr ", room)
 console.log("======== cccccccccccccc ", callFrame)
  return (
    <div className="index-container">
      <Header
        demoTitle={'Daily Prebuilt demo'}
        repoLink={
          'https://github.com/daily-demos/examples/tree/main/prebuilt/basic-embed'
        }
      />
      <main>
        {room ? (
          // <>call frame</>
          <Call
            room={room}
            expiry={expiry}
            setRoom={setRoom}
            setCallFrame={setCallFrame}
            callFrame={callFrame}
            roomName={roomName}
          />
        ) : (
          <Home
            setRoom={setRoom}
            setExpiry={setExpiry}
            isConfigured={isConfigured}
            callFrame={callFrame}
            roomName={roomName}
          />
        )}
      </main>
      <style jsx>{`
        .index-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow: auto;
          max-width: 1200px;
          margin: auto;
        }

        main {
          padding: 2rem;
          flex: 1;
        }

        :global(.field) {
          margin-top: var(--spacing-sm);
        }

        :global(.card) {
          margin: 8px;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const defaultProps = getDemoProps();

  return {
    props: defaultProps,
  };
}
