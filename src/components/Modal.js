/* eslint-disable jsx-a11y/img-redundant-alt */
import { useRef, useState } from 'react';

const Modal = ({
  setModalOpen,
  setSelectedImage,
  selectedImage,
  generateVariations,
}) => {
  const [error, setError] = useState(null);
  const ref = useRef(null);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const checkSize = () => {
    if (ref.current.width === 256 && ref.current.height === 256) {
      generateVariations();
    } else {
      setError('Error: choose size 256x256');
    }
  };

  return (
    <div className='modal'>
      <div onClick={closeModal}>✖</div>
      <div className='img-container'>
        {selectedImage && (
          <img
            ref={ref}
            src={URL.createObjectURL(selectedImage)}
            alt='uploaded image'
          ></img>
        )}
      </div>
      <p>{error || '* Image must be of size 256x256'}</p>
      {!error && <button onClick={checkSize}>Generate</button>}
      {error && <button onClick={closeModal}>Close this and try again</button>}
    </div>
  );
};

export default Modal;
