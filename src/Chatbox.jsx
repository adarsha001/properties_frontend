import { useState } from 'react';

import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,

} from '@botpress/webchat';

const clientId = "12c0f39e-b116-458e-8c69-bc5f6f3e16be";

const configuration = {
  color: '#000',
};

export default function Chatbox() {
  const client = getClient({
    clientId,
  });

  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WebchatProvider client={client} configuration={configuration}>
        <Fab onClick={toggleWebchat} />
        <div
          style={{
            display: isWebchatOpen ? 'block' : 'none',
          }}
        >
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}
