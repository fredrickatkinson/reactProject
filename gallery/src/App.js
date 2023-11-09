import {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { createApi } from 'unsplash-js';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [custom, setCustom] = useState('');
  const [focus, setFocus] = useState(false);
  
  useEffect(() => {
    const button = document.querySelector('.enter');
    const hidd = document.querySelector('.hide');
    if (custom === '') {
      setFocus(false);
      button.classList.add('hidden');
    }
    else {
      setFocus(true);
      button.classList.remove('hidden');
    }
  });
  useEffect(() => {
    search('field');
  }, []);

  const search = (query) => {
    const accessKey = 'DT1XUSvug9xEzH0u7H4Yg66Ix-3r1anXevpHPQ-KV38';
    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setImages(data.results);
      })
      .catch((error) => {
        console.error('Error fetching images from Unsplash:', error);
      })
  }

  const blur = (event) => {
    if (focus && event.key === 'Enter') {
      search(custom);
    }
  };

  return (
    <div className='mainPage'>
      <div className='nav'>
        <button onClick={() => search('nature')}>Nature</button>
        <button onClick={() => search('city')}>City</button>
        <button onClick={() => search('lake')}>Lake</button>
        <button onClick={() => search('sky')}>Sky</button>
        <button onClick={() => search('space')}>Space</button>
        <button onClick={() => search('animals')}>Animals</button>
        <input type='text' placeholder='Search...' value={custom} onChange={(e) => setCustom(e.target.value)}
         onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onKeyDown={blur}></input>
        <button className='enter' onClick={() => search(custom)}>Enter</button>
      </div>
      <div className='container'>
        {images.map((image) => (
          <img key={image.id} src={image.urls.regular} alt={image.description} className='image'/>
        ))}
      </div>
    </div>
  );
}

export default App;
