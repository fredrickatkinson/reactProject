import {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { createApi } from 'unsplash-js';

function App() {
  const [images, setImages] = useState([]);
  const api = createApi({
    accessKey: '',
  })
  const ex = ['one', 'two', 'buckle', 'my', 'shoe', 'three', 'four', 'buckle', 'some', 'more', 'five', 'six', 'nike', 'kicks'];
  
  useEffect(() => {
    setImages(ex);
    console.log(api);
  }, []); 

  return(
    <div className='mainPage'>
      <div className='nav'>

      </div>
      <div className='container'>
        {images.map((item, index) => (
          <div className='image' key={index}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export default App;
