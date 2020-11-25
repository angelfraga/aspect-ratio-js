import "./style.css";
import "./src/aspect-ratio.css";
import { AspectRatio } from "./src/aspect-ratio";

const aspectRatio = new AspectRatio({
  container: document.querySelector("#app"),
  mask: document.querySelector("#mask"),
  minHeight: 90,
  minWidth: 160,
  ratio: "16/9",
  align: "center center"
});

function getRandomRatio() {
  const ratios = ["16/9", "4/3", { numerator: 1, denominator: 1 }];
  const index = Math.floor(Math.random() * ratios.length);
  return ratios[index];
}

setInterval(() => {
  const ratio = getRandomRatio();
  aspectRatio.ratio = ratio;
  document.querySelector("#mask").textContent = JSON.stringify(ratio);
}, 2000);
