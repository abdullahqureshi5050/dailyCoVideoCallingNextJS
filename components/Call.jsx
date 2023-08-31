import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@custom/shared/components/Button';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@custom/shared/components/Card';
import { TextInput } from '@custom/shared/components/Input';
import DailyIframe from '@daily-co/daily-js';
import { writeText } from 'clipboard-polyfill';
import ExpiryTimer from './ExpiryTimer';
import axios from 'axios';

const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: '100%',
    width: '100%',
    aspectRatio: 16 / 9,
    minwidth: '400px',
    maxWidth: '920px',
    border: '0',
    borderRadius: '12px',
  },
};

export function Call({ room, setRoom, callFrame, setCallFrame, expiry }) {
  const callRef = useRef(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [callFrameState, setCallFrameState] = useState(null)
  const handleCopyClick = useCallback(() => {
    writeText(room);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 5000);
  }, [room, isLinkCopied]);


  const createAndJoinCall = useCallback(() => {
    const newCallFrame = DailyIframe.createFrame(
      callRef?.current,
      CALL_OPTIONS
    );

    setCallFrame(newCallFrame);
    newCallFrame.join({ url: room });

    const leaveCall = () => {
      setRoom(null);
      setCallFrame(null);
      if(callFrame)
      callFrame.destroy();
      setCallFrameState(null);
    };
    
    // const waitingParticipants = newCallFrame.waitingParticipants();

    // console.log("======= waitingParticipants, ", waitingParticipants)
    const count = newCallFrame.participantCounts();
    alert(count);
    console.log(count, "==== count")
    newCallFrame.on('left-meeting', leaveCall);

    newCallFrame.on("joined-meeting", ()=>{console.log("======== joined-meeting")})
    newCallFrame.on("participant-joined", ()=>{console.log("======== participant-joined")})
    newCallFrame.on("participant-left", ()=>{console.log("======= participant-left")})
    newCallFrame.on("app-message", ()=>{console.log("====== app-message")})
    newCallFrame.on('participants-change', (event) => {
      const updatedParticipants = event.participants;
      setParticipants(updatedParticipants.length); // Update participants count
      console.log("====== participants-change", updatedParticipants)
    });
  }, [room, setCallFrame]);

  /**
   * Initiate Daily iframe creation on component render if it doesn't already exist
   */

  const presence =  async (e)=> {
    e.preventDefault();
    alert(process.env.NEXT_PUBLIC_DAILY_API_KEY);
    axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}` 
    const res = await axios.get(
      `https://api.daily.co/v1/presence`
      // ,
      // { headers: {"Authorization" : `Bearer ${process.env.NEXT_PUBLIC_DAILY_API_KEY}`} }
    );
    // const res = await axios.get('/api/presence');
   
    if(res)
    console.log("+++++++++++++++++rrrrrrrrrrrrrrrrrreeeeeeeeeeeeeessssssssss", res);
  }

  useEffect(()=>{
    // setInterval(() => {
    //   presence()    
    // }, 5000)
  }
   , [])

  useEffect(() => {
    if (callFrameState)
    callFrameState
    .on("joined-meeting", ()=>{console.log("E======== joined-meeting", ()=>callFrameState.participants())})
    .on("participant-joined", ()=>{console.log("E======== participant-joined", ()=>callFrameState.participants())})
    .on("participant-left", ()=>{console.log("E======= participant-left",()=> callFrameState.participants())})
    .on("app-message", ()=>{console.log("E====== app-message", callFrameState.participants())})
    .on('participants-change', (event) => {
      const updatedParticipants = event.participants;
      setParticipants(updatedParticipants.length); // Update participants count
      console.log("====== participants-change", updatedParticipants)
    });
    return () => {
      }
  }, [callFrameState])
  
  useEffect(() => {
    if (!room) {
      console.log("room is null");
      return null;
  }
  if(!callFrame){
    console.log("callFrame is null");
    return null;
  }
  const participants = callFrame.participants();
  console.log("ccccccccccc" , participants);
  // DailyEvent("joined-meeting", useCallback(ev)=>
  //    console.log(`Joined meeting ${JSON.stringify(ev)}`)
  // ,[]);
  
  }, [room]);

  useEffect(() => {
    if (callFrame) return;

    createAndJoinCall();
  }, [callFrame, createAndJoinCall]);

  return (
    <div>
      <div className="call-container">
        {/* Daily iframe container */}
        <div ref={callRef} className="call" />
        <Card>
          <CardHeader>Copy and share the URL to invite others</CardHeader>
          <Button onClick={(e)=>presence(e)}>Presence</Button>
          <CardBody>
            <label htmlFor="copy-url"></label>
            <TextInput
              type="text"
              id="copy-url"
              placeholder="Copy this room URL"
              value={room}
              pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
            />
            <Button onClick={handleCopyClick}>
              {isLinkCopied ? 'Copied!' : `Copy room URL`}
            </Button>
            <div>
              <h2>Connected Participants:</h2>
              <ul>
                {participants.map((participant) => (
                  <li key={participant.user_id}>
                    {participant.user_name || 'Participant'}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
          <CardFooter>
            {expiry && (
              <CardFooter>
                Room expires in:
                <ExpiryTimer expiry={expiry} />
              </CardFooter>
            )}
            
          </CardFooter>
        </Card>
        <style jsx>{`
          .call-container {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
          }
          .call-container :global(.call) {
            width: 100%;
          }
          .call-container :global(.button) {
            margin-top: var(--spacing-md);
          }
          .call-container :global(.card) {
            max-width: 300px;
            max-height: 400px;
          }
          .call-container :global(.card-footer) {
            align-items: center;
            gap: var(--spacing-xxs);
          }
          .call-container :global(.countdown) {
            position: static;
            border-radius: var(--radius-sm);
          }
          @media only screen and (max-width: 750px) {
            .call-container {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Call;
