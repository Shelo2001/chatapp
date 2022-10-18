import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      }

      await socket.emit('send_message', messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage('')
    }
  }

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Room ID: {room}</p>
      </div>

      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((message) => {
            return (
              <div
                className='message'
                id={username === message.author ? 'you' : 'else'}
              >
                <div>
                  <div className='message-content'>
                    <p>{message.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>
                      Sent on {message.time} By <bold>{message.author}</bold>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === 'Enter' && sendMessage()
          }}
          type='text'
          value={currentMessage}
          placeholder='Message...'
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
