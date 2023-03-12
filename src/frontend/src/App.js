import React, { useState,useContext } from 'react'
import { SocketContext } from './SocketContext'
import "./App.css"
import main from "./main-logo.png"
import { io } from 'socket.io-client'
import VideoPlayer from './Components/CallPage/VideoPlayer'

const socket = io.connect("http://localhost:3001");

const App = () => {
   const  { setName,callUser }  = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(123);
  const [show, setShow] = useState(false);

  const func = () => {
    callUser(idToCall);
    socket.emit("join_room", room);
    setShow(true);
  }

  return (
    <div>
      {
        !show ? (
        <div className='home'>
          <div className='nav'>
            <p> MeetEase </p>
             </div>
                     
               <div className='container'>
       
                 <div className='contain1'>
                 <p>Meet, chat, call, and <br/> collaborate in just one place</p>
                 <h5>Instantly start a video chat for two people with the touch of a button</h5>
                 
                 <div className='inputs'>
                <div className='input1'> <input id='btn1' placeholder='Enter Name' onChange={(e) => setName(e.target.value)} /> 
                <button id='btn2' onClick={func}>New Meeting </button> </div>
                 <div className='input2'> 
                 <input id='btn3' placeholder='Enter Meeting Code' onChange={(e) => setIdToCall(e.target.value)} />
                  <input id='btn4' placeholder='Enter Name' onChange={(e) => setName(e.target.value)} />
                  <button id='btn5' onClick={func}> Join Meeting </button> </div>
                 </div>
       
                 </div>
                 <div className='contain2'>
                     <img src={main} alt='/' />
                 </div>
               </div>
            </div>

        ) : (
          <VideoPlayer socket={socket} username={username} room={room} />
        )}
  </div>
  )
  }

export default App
