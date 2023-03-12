import React, { useRef , useState,useEffect,useContext } from 'react'
import { SocketContext } from '../../SocketContext'
import "./videoplayer.css"
import { BsFillMicFill,BsFillCameraVideoFill,BsFillPersonPlusFill,BsClipboardCheck } from "react-icons/bs"
import { HiPhoneMissedCall } from "react-icons/hi"
import {FiSend } from "react-icons/fi"
import { Scrollbars } from 'react-custom-scrollbars';
import emailjs from "emailjs-com"

const VideoPlayer = ({ socket, room }) => {
    const {    
        call,
        callAccepted,
        userVideo,
        stream,
        name,
        callEnded,
        me,
        leaveCall,
        answerCall, } = useContext(SocketContext);

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [mail, setMail] = useState("");

    const sendMessage = async () => {
      if (currentMessage !== "") {
        const messageData = {
        room: room,
        author: name,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const sendemail = () => {
    const email = prompt("Enter Email");
    setMail(email);
    var templateParams = {
        me: me,
        mail : mail
    };
    emailjs.send('service_p7j2klh', 'template_8orjham', templateParams, 'HOrGbLD_NcUN6DKls')
    .then(function(response) {
       alert("Sent");
    }, function(error) {
       alert('FAILED...', error);
    });
  }

  const videoRef = useRef();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
  }, [])

    return (
        <div className='videoplayer'>
            <div className='header'>
                <div className='main-header'>
                        <p>MeetEase Meetings </p>
                </div>
                <div className='next-header'>
                    <div className='btns1'>
                    <button>Mute <BsFillMicFill /> </button>
                    <button> Stop Video <BsFillCameraVideoFill /> </button>
                    <button onClick={() => {navigator.clipboard.writeText(me)}}> Copy Meeting Code <BsClipboardCheck /> </button>
                    <button onClick={sendemail}> invite <BsFillPersonPlusFill /> </button>
                    </div>

                    <div className='btns2'>
                    <button onClick={leaveCall}><HiPhoneMissedCall /> Leave</button>
                    </div>
                </div>
            </div>

            <div className='broadcast'>
            <div className='meet'>

            {stream &&(
                <div>
                    <p>{name}</p>
                    <video playsInline ref={videoRef} autoPlay />
                </div>
                
            )}

            {callAccepted && !callEnded &&  (
                    <div>
                        <p>{call.name}</p>
                        <video playsInline ref={userVideo} autoPlay />
                     </div>
            )}

            </div>
            
            <div className='chat'>
                <div className='participants'>
                    {
                        call.isReceivingCall && !callAccepted && (
                            <div>
                            <p>{call.name} wants to join the meeting   <button onClick={answerCall}> Accept </button></p>
                            </div>
                        )
                    }
                       

                </div>
                
                
                <div className='conversation'>
                    <p>Meeting Chat</p>
                    <Scrollbars style={{  height: "81vh" }}>
                    <div className='chat-content'>
                        {messageList.map((messagecontent) => {
                            return (
                            <div id={name === messagecontent.author ? "you" : "other"}>
                                <p>{messagecontent.author} : {messagecontent.message}</p>
                                <p>{messagecontent.time}</p>
                           </div>
                            )
                        })
                        }
                    </div>
                    </Scrollbars>
                    
                    <div className='buttons'>
                    <input placeholder='Type Something...' value={currentMessage} onChange={(event) => {setCurrentMessage(event.target.value) }} onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }} /> <button onClick={sendMessage}><FiSend size={20}/></button>
                    </div>
                    
                </div>
            </div>
            
            </div>


        </div>
    )
}

export default VideoPlayer