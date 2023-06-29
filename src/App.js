import { useState } from 'react';
import './App.css';
import Modal from './components/Modal';

function App() {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const surpriseOptions = [
    'A blue ostrich eating melon',
    'A mattise style shark on the telephone',
    'A pinnaple sunbathing on an island',
  ];

  const getImages = async () => {
    setImages(null);
    console.log('clicked getImages');
    if (value === '') {
      setError('Search term cannot be empty!');
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      };
      const response = await fetch('http://localhost:8000/images', options);
      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  const surpriseMe = async () => {
    setImages(null);
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setModalOpen(true);
    setSelectedImage(e.target.files[0]);
    e.target.value = null;

    try {
      const options = {
        method: 'POST',
        body: formData,
      };
      const response = await fetch('http://localhost:8000/upload', options);
      const data = await response.json();
      console.log(data);
    } catch (error) {}
  };

  const generateVariations = async () => {
    setImages(null);
    if (selectedImage === null) {
      setError('Error! You need to upload an image first...');
      setModalOpen(false);
      return;
    }
    try {
      const options = {
        method: 'POST',
      };
      const response = await fetch('http://localhost:8000/variations', options);
      const data = await response.json();
      console.log(data);
      setImages(data);
      setError(null);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='App'>
      <section className='search-section'>
        <p>
          Start with a detailed description{' '}
          <span className='surprise' onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className='input-container'>
          <input
            value={value}
            placeholder='An impressionist oil painting of a sunflower in a purple vase'
            onChange={(e) => setValue(e.target.value)}
          ></input>
          <button onClick={getImages}>Generate</button>
        </div>
        <p className='extra-info'>
          Or,
          <span>
            <label htmlFor='files'> upload an image </label>
            <input
              onChange={uploadImage}
              id='files'
              accept='image/*'
              type='file'
              hidden
            ></input>
          </span>
          to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen && (
          <div className='overlay'>
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations}
            ></Modal>
          </div>
        )}
      </section>
      <section className='image-section'>
        {images?.map((image, _index) => (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            key={_index}
            src={image.url}
            alt={`Generated image of ${value}`}
          ></img>
        ))}
      </section>
    </div>
  );
}

export default App;
