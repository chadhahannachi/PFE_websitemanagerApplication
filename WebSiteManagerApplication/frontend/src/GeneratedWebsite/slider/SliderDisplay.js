
import React from 'react';
import '../../website/slider/Slider.css';

import SliderStyleTwoDisplay from './SliderStyleTwoDisplay';
import SliderStyleOne from '../../website/slider/SliderStyleOne';

const styles = [
  { name: 'Classic Slider', component: SliderStyleOne },
  { name: 'Modern Slider', component: SliderStyleTwoDisplay },
];

export default function SliderDisplay({ styleIndex, entrepriseId, sliderStyles = {} }) {
  const SliderComponent = styles[styleIndex]?.component || SliderStyleOne;

  // Si le composant est SliderStyleTwoDisplay, passer sliderStyles
  if (SliderComponent === SliderStyleTwoDisplay) {
    return <SliderComponent entrepriseId={entrepriseId} sliderStyles={sliderStyles} />;
  }
  return <SliderComponent entrepriseId={entrepriseId} />;
}