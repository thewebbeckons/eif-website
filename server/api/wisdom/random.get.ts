import wisdom from '../../assets/wisdom.json';

export default defineEventHandler((event) => {
  // If the array is empty or undefined, return a fallback
  if (!wisdom || !wisdom.responses || wisdom.responses.length === 0) {
    return {
      quote: "Analysis indicates you have forgotten to generate the wisdom quotes. Fascinating."
    };
  }

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * wisdom.responses.length);
  const selectedQuote = wisdom.responses[randomIndex];

  return {
    quote: selectedQuote
  };
});
