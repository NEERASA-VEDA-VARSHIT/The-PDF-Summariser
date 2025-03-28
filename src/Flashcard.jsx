import React, { useState } from "react";

function Flashcard({flashcards}) {
  const [flipped, setFlipped] = useState(false);
  const [counter, setCounter] = useState(0);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (counter < flashcards.length - 1) {
      setCounter(counter + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (counter > 0) {
      setCounter(counter - 1);
      setFlipped(false);
    }
  };

  const currentFlashcard = flashcards[counter];

  return (
    
    <div id="flash-cards" className="mt-8 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Flash Cards</h2>
        <p className="text-gray-600">
          Card {counter + 1} of {flashcards.length}
        </p>
      </div>

      {/* Stack Effect Container */}
      <div className="relative h-[400px] w-full max-w-2xl mx-auto">
        {/* Stack Effect Layers */}
        <div className="absolute inset-x-0 top-6 h-[400px] bg-gray-100 rounded-xl transform rotate-2 shadow-sm"></div>
        <div className="absolute inset-x-0 top-3 h-[400px] bg-gray-200 rounded-xl transform -rotate-1 shadow-md"></div>
        
        {/* Active Card */}
        <div className="relative perspective-1000">
          <div
            className={`relative h-[400px] transition-transform duration-700 transform-style-preserve-3d cursor-pointer 
              ${flipped ? 'rotate-y-180' : ''}`}
            onClick={handleFlip}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-2xl p-8 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Question
                </h3>
                <p className="text-xl text-gray-700 text-center leading-relaxed">
                  {currentFlashcard.question}
                </p>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-sm text-gray-500 text-center">
                Click to flip
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl p-8 rotate-y-180 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Answer
                </h3>
                <p className="text-xl text-gray-700 text-center leading-relaxed">
                  {currentFlashcard.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-12">
        <button 
          className={`px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105
            ${counter > 0 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          onClick={handlePrevious}
          disabled={counter === 0}
        >
          Previous
        </button>
        <button 
          className={`px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105
            ${counter < flashcards.length - 1 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={counter === flashcards.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Flashcard;