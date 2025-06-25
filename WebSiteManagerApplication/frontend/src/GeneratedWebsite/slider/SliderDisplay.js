
import React from 'react';
import '../../website/slider/Slider.css';

import SliderStyleTwoDisplay from './SliderStyleTwoDisplay';
import SliderStyleOne from '../../website/slider/SliderStyleOne';

const styles = [
  { name: 'Classic Slider', component: SliderStyleOne },
  { name: 'Modern Slider', component: SliderStyleTwoDisplay },
];

export default function SliderDisplay({ styleIndex, entrepriseId  }) {
  const SliderComponent = styles[styleIndex]?.component || SliderStyleOne;

  return <SliderComponent entrepriseId={entrepriseId} />;
}