import {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [custom, setCustom] = useState('');
  const [focus, setFocus] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageCount = useRef(0);
  const ky = useRef(null);
  const totalImages = 80;
  let finished = false;
  const fetchedImages = useRef(new Set());

  useEffect(() => {
    const button = document.querySelector('.enter');
    if (custom === '') {
      setFocus(false);
      button.classList.add('hidden');
    }
    else {
      setFocus(true);
      button.classList.remove('hidden');
    }
  });

  const fetchMoreImages = async (query) => {
    const imagesPerPage = 10;
    const totalPages = Math.ceil(totalImages / imagesPerPage);
    setImages([]);
    imageCount.current = 0;
    
    let page = 1;
    while (imageCount.current < totalImages && page <= totalPages) {
      await search(query, page, imagesPerPage);
      page++;
    }
    /*
    for (let page = 1; page <= totalPages && !finished; page++) {
      if (imageCount.current >= totalImages) {
        finished = true;
        break;
      }
      await search(query, page, imagesPerPage);
    }
    */
  };
  useEffect(() => {
    if (images.length >= totalImages) {
      imageCount.current = totalImages;
    }
  }, [images]);

  useEffect(() => {
    fetchMoreImages('field');
  }, []);

  const search = async (query, page, perPage) => {
    if (focus && custom === '') {
      query = 'field';
    }
    const accessKey = 'DT1XUSvug9xEzH0u7H4Yg66Ix-3r1anXevpHPQ-KV38';
    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&page=${page}&per_page=${perPage}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      updateImages(data.results);
    }
    catch (error) {
      console.error('Error fetching images from Unsplash:', error);
      return {results: []};
    }
  };

  const updateImages = (newImages) => {
    setImages((prevImages) => {
      const uniqueImages = newImages.filter(
        (image) => !fetchedImages.current.has(image.id)
      );
      fetchedImages.current = new Set([
        ...fetchedImages.current,
        ...uniqueImages.map((image) => image.id),
      ]);
      if (imageCount.current + uniqueImages.length >= totalImages) {
        finished = true;
      }
      imageCount.current += uniqueImages.length;
      return [...prevImages, ...uniqueImages];
    })
  }

  const blur = (event) => {
    if (focus && event.key === 'Enter') {
      fetchMoreImages(custom);
    }
  };
  const click = () => {
    const hasC = ky.current.classList.contains('hidden');
    if (!hasC) {
      setFocus(true);
      fetchMoreImages(custom);
    }
  }
  const openImage = (key, img, alt) => {
    setSelectedImage({key, img, alt})
    const main = document.querySelector('.mainPage');
    main.classList.add('hide');
  }
  const closeImage = () => {
    setSelectedImage(null);
    const main = document.querySelector('.mainPage');
    main.classList.remove('hide');
  }

  return (
    <>
      <div className='mainPage'>
        <div className='nav'>
          <button onClick={() => fetchMoreImages('nature')}>Nature</button>
          <button onClick={() => fetchMoreImages('city')}>City</button>
          <button onClick={() => fetchMoreImages('lake')}>Lake</button>
          <button onClick={() => fetchMoreImages('sky')}>Sky</button>
          <button onClick={() => fetchMoreImages('space')}>Space</button>
          <button onClick={() => fetchMoreImages('animals')}>Animals</button>

          <input type='text' placeholder='Search...' value={custom} onChange={(e) => setCustom(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onKeyDown={blur}></input>
          <button className='enter' onClick={() => click()} ref={ky}>Enter</button>
        </div>
        <div className='container'>
          {images.map((image, index) => (
            <img key={index} src={image.urls.regular} onClick={() => openImage(image.id, image.urls.regular, image.description)} alt={image.description} className='image'/>
          ))}
        </div>
      </div>
      {selectedImage && (
        <div className='single'>
          <img key={selectedImage.key} src={selectedImage.img} alt={selectedImage.alt} className='selected' />
          <button onClick={closeImage} className='exit'>Exit</button>
        </div>
      )}
    </>
    
  );
}

export default App;