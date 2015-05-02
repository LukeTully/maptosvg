# Map to SVG
Convert image maps to an exact SVG representation

# Install
```
<script src="https://raw.githubusercontent.com/LukeTully/maptosvg/master/maptosvg.js"></script>
```

# Usage
At the moment, conversion is done by means of passing the id of your image—The image that needs the map— to the SVGM function.
This function returns an SVG element which can be added to the DOM in whatever manner you choose.

## Example
'''
var svg1 = SVGM("map2");
	var image1 = document.getElementById("map2");
	image1.parentNode.appendChild(svg1);
'''