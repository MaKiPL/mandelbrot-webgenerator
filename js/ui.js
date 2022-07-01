const iterElem = document.getElementById("iter");
const scaleElem = document.getElementById("scale");
const iterRange = document.getElementById("iterRange");
const zoomRange = document.getElementById("scaleValue");

const COLOR_SELECTOR = ["r", "g", "b"];
const VECTOR_SELECTOR = ["X", "Y", "Z"];
const COLOR_COLORNAME = "Color";

var COLOR_ELEMENTS = [];
var COLOR_PICKERS = [];

var colorVectors = [];


for(var i = 0; i < COLOR_SELECTOR.length; i++) {
  for(var j = 0; j < VECTOR_SELECTOR.length; j++) {
    const colorElement = document.getElementById(COLOR_SELECTOR[i] + VECTOR_SELECTOR[j]);
    COLOR_ELEMENTS.push(colorElement);
    colorElement.addEventListener("change", function () {
      updateColor(colorElement);
    });
  }
  const colorPickerElement = document.getElementById(COLOR_SELECTOR[i] + COLOR_COLORNAME);
  COLOR_PICKERS.push(colorPickerElement);
    colorPickerElement.addEventListener("change", function() {
      updateColor(colorPickerElement);
    });
}


function uiResetCommon() {
  scaleElem.value = scale;
  zoomRange.value = scale;
  colorVectors = [];
  colorVectors.push(RED);
  colorVectors.push(GREEN);
  colorVectors.push(BLUE);
  updatePickers();
}

function updatePickers()
{
  for(let i = 0; i < colorVectors.length; i++)
  {
    COLOR_ELEMENTS[i*3].value = colorVectors[i][0];
    COLOR_ELEMENTS[i*3+1].value = colorVectors[i][1];
    COLOR_ELEMENTS[i*3+2].value = colorVectors[i][2];
    COLOR_PICKERS[i].value = "#" + colorVectors[i]
        .map(x => Math.floor(x*255)
            .toString(16)
            .padStart(2, "0"))
        .join("");
  }
}

iterElem.value = iterations;

var mpostionInitial = { x: null, y: null };
var mpostionFinal = { x: null, y: null }, iterations;
canvas.addEventListener("wheel", function (e) {
  e.preventDefault();
  factor = -0.0005 * e.deltaY;
  if (factor + scale > 0.0) {
    scale *= (1 + factor);
    scaleElem.value = Math.sqrt(scale);
    zoomRange.value = scaleElem.value;
  }
});
canvas.addEventListener("mousedown", function (e) {
  e.preventDefault();
  mpostionInitial = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener("mousemove", function (e) {
  e.preventDefault();

  if (mpostionInitial.x !== null) {
    if (mpostionFinal.x !== null) {
      var diff = { x: e.clientX - mpostionFinal.x, y: e.clientY - mpostionFinal.y }
      console.log(diff)
      offset[0] -= 0.05 * diff.x * 1.0 / (10.0 * scale);
      offset[1] += 0.05 * diff.y * 1.0 / (10.0 * scale);
    }
    mpostionFinal = { x: e.clientX, y: e.clientY };
  }
  updateRealImaginary();
});
canvas.addEventListener("mouseup", function (e) {
  e.preventDefault();
  mpostionInitial = { x: null, y: null };
  mpostionFinal = { x: null, y: null };
});

iterElem.addEventListener("change", function (e) {
  iterations = e.target.value;
});

scaleElem.addEventListener("mousemove", function (e) {
  val = e.target.value;
  scale = val * val;
  zoomRange.value = val;
});

scaleElem.addEventListener("change", function (e) {
  val = e.target.value;
  scale = val * val;
});

iterRange.addEventListener("change", function (e) {
  iterElem.value = e.target.value;
  iterations = e.target.value;
});

zoomRange.addEventListener("change", function (e) {
  scaleElem.value = e.target.value;
  scale = e.target.value * e.target.value;
});

function updateRealImaginary() {
  document.getElementById("real").innerHTML =
      "X: " + offset[0].toFixed(3);
  document.getElementById("imaginary").innerHTML =
      "Y: " + offset[1].toFixed(3);
}

function updateColor(elem)
{
  if(elem.id.endsWith(COLOR_COLORNAME)) //colorPicker
  {
    const colIndex = elem.id[0];
    let startIndex = 0;
    switch(colIndex)
    {
      case "g":
        startIndex = 3;
        break;
        case "b":
        startIndex = 6;
        break;
    }
    let color = elem.value.substring(1);

    for(let i = 0; i < VECTOR_SELECTOR.length; i++)
    {
      const numberElement = COLOR_ELEMENTS[startIndex+i];
      const colorLocal = color.substring(0, 2);
      numberElement.value = parseInt(colorLocal, 16)/256.0;
      color = color.substring(2);
    }
  }

  for(let i = 0; i < COLOR_ELEMENTS.length; i++)
  {
    let positionLeft = i%3;
    let vectorIndex = Math.floor(i/3);
    let numberElement = COLOR_ELEMENTS[i];
    colorVectors[vectorIndex][positionLeft] = numberElement.value;
  }

    updatePickers();

}



uiResetCommon();