import './normal.css';
import './App.css';
import { useState ,useEffect } from 'react';
import logo1 from './img/Capture.JPG'
import logo2 from './img/Capture2.JPG'
function App() {
  useEffect(()=>{
       getEngines()
  },[])
  const [input,setInput] = useState('')
  const [models,setModels] = useState([])
  const [currentModel,setCurrentModel] = useState('text-davinci-003')
  const [chatLog,setChatLog] = useState([{
    user:'gpt',
    message:'How Can I Help?'
  },{
    user:'me',
    message:'I am trying chatGPT'
  }])

 async function getEngines(){
  fetch('https://ab-chatgpt-server.onrender.com/models')
    .then(res => res.json())
    .then(data => setModels(data.models))
 }

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog,{user:'me',message:`${input}`}];
    setInput('')
    setChatLog(chatLogNew)
    const messages = chatLogNew.map((message)=>message.message).join('\n')
    try{
    const response = await fetch('https://ab-chatgpt-server.onrender.com/',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        message:messages,
        currentModel:currentModel
      })
    })
    const data = await response.json();
    setChatLog([...chatLogNew,{user:'gpt',message:`${data.message}`}])
  }catch(e){
    setChatLog([...chatLogNew,{user:'gpt',message:'The server is not being access call abrham now '}])
  }
  }

  function clearChat(){
    setChatLog([])
  }
  return (
    <div className="App">
      <aside className='sideMenu'>
        <div className='side-menu-button' onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <label className='models'>
          <span>Select the AI Model(optional)</span>
          <select onChange={(e) => setCurrentModel(e.target.value)}>
            {
              models.map((model,index) => (
                <option key={model.id} value={model.id}>{model.id}</option>
              ))
            }
          </select>
        </label>  
      </aside>
      <section className='chatBox'>
        <div className='chat-log'>
          {
            chatLog.map((message,index) => {
              return(
              <ChatMessage key={index} message={message}/>)
            })
          }
        </div>
        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            <input
            rows='1'
            value={input}
            onChange={(e) => {setInput(e.target.value)}}
            className='chat-input-textarea'
            placeholder='Type Your Message Here'></input>
            </form>
        </div>
        <span className='copyright'>Developed by Abrham Tesfaye @october 1 2023 using OpenAIApi</span>
      </section>
    </div>
  );
}


const ChatMessage = ({message}) =>{
  return(
    <div className={`chat-message ${message.user==='gpt' && 'chatgpt'}`}>
    <div className='chat-message-center'>
        <div className={`avatar ${message.user==='gpt' && 'chatgpt'}`}>
            <img src={message.user==='gpt'? logo2:logo1} alt='ab'/>
        </div>
        <div className='message'>
          {message.message}
        </div>
    </div>
  </div>
  )
}


export default App;
