import React, { useEffect } from 'react';
import { 
  CallingState, 
  StreamCall, 
  StreamVideo, 
  StreamVideoClient, 
  useCallStateHooks, 
  ParticipantView, 
  StreamTheme,
  StreamVideoParticipant 
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import './VideoCall.css'; // Đảm bảo bạn có file CSS này trong cùng thư mục
import CallIcon from '@mui/icons-material/Call';

// Khóa API và mã thông báo của bạn
const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0lHXzg4IiwidXNlcl9pZCI6IklHXzg4IiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzAwMTI3MDIsImV4cCI6MTczMDYxNzUwMn0.LVJn9uT2WpBt4GWW6-wxP_KKlFXLHReJz7fSqnEMguU';
const userId = 'IG_88';
const callId = 'lg8UiLcRoDYE';

const user = {
  id: userId,
  name: 'Oliver',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

// Khởi tạo StreamVideoClient
const client = new StreamVideoClient({ apiKey });
client.connectUser(user, token);
const call = client.call('default', callId);

export default function App() {
  // Sử dụng useEffect để tham gia cuộc gọi khi ứng dụng được tải
  useEffect(() => {
    const joinCall = async () => {
      await call.join({ create: true });
    };
    joinCall();
  }, []);
  
  // Hàm xử lý kết thúc cuộc gọi
  const endCall = async () => {
    await call.leave(); // Rời khỏi cuộc gọi
  };

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout onEndCall={endCall} />
      </StreamCall>
    </StreamVideo>
  );
}

// Tùy chỉnh giao diện người dùng
export const MyUILayout = ({ onEndCall }) => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  // Hiển thị trạng thái chờ nếu chưa kết nối
  if (callingState !== CallingState.JOINED) {
    return <div className="loading">Đang kết nối...</div>;
  }

  return (
    <StreamTheme className="theme-wrapper">
      <div className="video-call-container">
        <div className="main-video">
          {localParticipant ? (
            <ParticipantView participant={localParticipant} />
          ) : (
            <div className="loading">Đang tải người dùng...</div>
          )}
        </div>
        <MyParticipantList participants={remoteParticipants || []} />

        {/* Nút kết thúc cuộc gọi */}
        <div className="bottom-bar">
          <button onClick={onEndCall} className="end-call-button"><CallIcon/></button>
        </div>
      </div>
    </StreamTheme>
  );
};

// Hiển thị danh sách người tham gia
export const MyParticipantList = ({ participants }) => {
  return (
    <div className="participant-list">
      {participants.map((participant) => (
        <div className="participant-view" key={participant.sessionId}>
          <ParticipantView muteAudio participant={participant} />
        </div>
      ))}
    </div>
  );
};
