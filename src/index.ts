import { AspectRatio } from 'aspect-ratio';
import './src/aspect-ratio.css';
import './style.css';

const aspectRatio = new AspectRatio({
  container: document.querySelector('#app') as HTMLElement,
  mask: document.querySelector('#mask') as HTMLElement,
  minHeight: 90,
  minWidth: 160,
  ratio: '16/9',
  align: 'center center',
});

function getRandomRatio() {
  const ratios = ['16/9', '4/3', { numerator: 1, denominator: 1 }];
  const index = Math.floor(Math.random() * ratios.length);
  return ratios[index];
}

setInterval(() => {
  const ratio = getRandomRatio();
  const mask = document.querySelector('#mask') as HTMLElement;
  aspectRatio.ratio = ratio;
  mask.textContent = JSON.stringify(ratio);
}, 2000);
