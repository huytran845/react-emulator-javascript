/*createElement is a function that defines the element that gets passed into it, returning all values but ensuring the props is returned as an empty array.
Javascript ... operator spreads elements of an array into individual values. */
const createElement = (type, props, ...children) => {
  if (props === null) props = {};
  return { type, props, children };
};
