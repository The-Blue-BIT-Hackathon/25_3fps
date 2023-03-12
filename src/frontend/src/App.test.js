import renderer from 'react-test-renderer';
import React, { useState,useContext } from 'react'
import { SocketContext } from './SocketContext'

import main from "./main-logo.png"
import { io } from 'socket.io-client'
import VideoPlayer from './Components/CallPage/VideoPlayer'
import App from './App';

jest.mock('./SocketContext');
jest.mock("./App.css");
jest.mock("./main-logo.png");
jest.mock('socket.io-client');
jest.mock('./Components/CallPage/VideoPlayer');

const renderTree = tree => renderer.create(tree);
describe('<App>', () => {
  it('should render component', () => {
    expect(renderTree(<App 
    />).toJSON()).toMatchSnapshot();
  });
  
});