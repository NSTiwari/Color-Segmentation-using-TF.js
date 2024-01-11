# Color Segmentation using TF.js
This repository demonstrates the implementation of colour-based segmentation in real-time on the browser using TensorFlow.js. No models, purely tensors.

## Steps to run:

1. Clone the repository on your local machine.
   
2. Launch a local server. If you have Python installed, navigate to the repository's directory, and run the command ```py -m http.server```.
   
3. Open ```localhost:8000``` on your web browser and see color-based segmentation in action.

## Color thresholds
| Colour | Lower Limit | Upper Limit |
| --------- | --------- | ---- |
| Red | (0, 50, 50) | (360, 255, 255) |
| Green | (75, 50, 50) | (360, 255, 255) |
| Blue | (150, 50, 50) | (360, 255, 255) |
| Yellow | (40, 50, 50) | (80, 255, 255) |
| Orange | (20, 50, 50) | (140, 255, 255) |

The threshold limits may vary depending upon the lighting conditions, brightness, and orientation of the objects.

## Output
![GitHub Logo](color-segmentation-tfjs.gif)
