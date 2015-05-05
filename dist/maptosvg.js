(function ( global ) {
	var map, areaSet, image, mapDims, mapDimSet = [], shape, errors = {
		"noID": "No image ID was provided",
		"noAreas": "No areas were found",
		"noMap": "No map was found for this image",
		"noImage": "The image with the given ID does not exist"
	}, mapElCache                               = [];
	var SVGM = function ( imageId ) {

		if (!imageId) {
			return errors.noID;
		}
		image = document.getElementById(imageId);
		if (!image) {
			return errors.noImage;
		}
		if (map = getMapFromImage(image)) {
			areaSet = map.getElementsByTagName("area");
			if (areaSet.length < 1) {
				return errors.noAreas;
			}

			for (var i = 0; i < areaSet.length; i++) {

				//TODO: Pull this piece of code out to modularize
				mapDimSet.push(parseCoords(areaSet[i]));
			}
		}
		else {
			return false;
		}

		// Render the svg
		var svg = getSVG(getAttributeValue(image, "width"), getAttributeValue(image, "height"), mapDimSet);

		return svg;
	};

	if (!window.SVGM) {
		window.SVGM = SVGM;
	}

	// Accepts an element
	function getAttributeValue ( e, a ) {
		if (!typeof e.getAttribute == "function") {
			return false;
		}
		else {

			return e.getAttribute(a);
		}
	}

	function getMapFromImage ( image ) {
		if (currentMapId = image.attributes.getNamedItem("usemap").value) {
			map = document.querySelector(currentMapId); // Using querySelector rather than getElementById becuase the attribute has a hashtag
			if (!map) {
				console.log(errors.noMap);
				debugger;
				return false;
			}
			return map;
		}
	}

	var createAreas = function ( areaList ) {

	};

	function determineShape ( el ) {
		if (sh = el.attributes.getNamedItem("shape").value) {
			switch (sh) {
				case "rect":
					return sh;
				case "rectangle":
					return "rect";
				case "poly":
					return sh;
				case "polygon":
					return "poly";
				case "circ":
					return sh;
				case "circle":
					return "circ";

			}
			errors.push({
				error: "Invalid Shape",
				node: el
			});
		}
		else {
			return false;
		}
	};
	var getWidthFromRect = function () {
	};
	var getHeightFromRect = function () {
	};
	var getImageDims = function () {
	};

	// Not robust implementation
	function getSVG ( width, height, elList ) {
		//TODO: Write the conversion to an svg element
		var newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var svgAnchor;
		//newSvg.setAttributeNS( null, "width", width );
		//newSvg.setAttributeNS( null, "height", height );
		// Construct the viewBox attribute of a coordinate space starting at 0,0 and an area of the width and height of the image
		newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		newSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
		newSvg.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
		newSvg.classList.add("mapped-svg"); // Give the new SVG Element a class
		var newShape;

		for (var i = elList.length - 1; i > 0; i--) {

			switch (elList[i].type) {
				case "rect":
					newShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
					newShape.setAttributeNS(null, "width", elList[i].width);
					newShape.setAttributeNS(null, "height", elList[i].height);
					newShape.setAttributeNS(null, "x", elList[i].x);
					newShape.setAttributeNS(null, "y", elList[i].y);
					newShape.classList.add("map-area-rect");
				case "poly":
					newShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
					newShape.setAttributeNS(null, "points", elList[i].points);

			}
			svgAnchor = createSVGAnchor(elList[i]);
			if (svgAnchor) {
				svgAnchor.appendChild(newShape);
				newSvg.appendChild(svgAnchor);
			}
			else {
				newSvg.appendChild(newShape);
			}

		}
		return newSvg;

	}

	function createSVGAnchor ( el ) {
		if (el.href && el.href.length > 0) {
			var anchor = document.createElementNS("http://www.w3.org/2000/svg", "a");
			anchor.setAttributeNS("http://www.w3.org/1999/xlink", "href", el.href);
			return anchor;
		}
		return false;
	}

	function parsePolyCoords ( el ) {
		// All this does is fix the spacing in the coords list if it is incorrect
		var points, pointsList, pointString, shape = {};
		points = el.attributes.getNamedItem("coords").value;

		if (points.length < 1) {
			return "Coordinate count is too short";
		}
		if (points.match(/[\ ]/) !== null) {
			return points;
		}

		pointsList = points.split(",");
		pointString = pointsList[0];
		for (var i = 1; i < pointsList.length; i++) {
			i % 2 === 0 ? pointString += " " : pointString += ",";
			pointString += pointsList[i];
		}

		shape.points = pointString;
		shape.type = "poly";
		var href = parseHref(el);
		if (href) {
			shape.href = href;
		}
		return shape;
	}

	function parseRect ( el ) {
		var width, height, coords, href;
		coords = el.attributes.getNamedItem("coords").value;
		var coordsList = [];

		if (coords) {
			coordsList = coords.split(",");
		}
		width = getWidth();
		height = getHeight();
		var shape = {
			x: coordsList[0],
			y: coordsList[1],
			width: width,
			height: height,
			type: "rect"
		};

		href = parseHref(el);
		if (href) {
			shape.href = href;
		}
		return shape;

		function getHeight () {
			if (coordsList.length > 4) {
				throw "This is not a rectangle, it has " + coordsList.length + "vertices";
			}
			return coordsList[3] - coordsList[1];
		};
		function getWidth () {
			if (coordsList.length > 4) {
				throw "This is not a rectangle, it has " + coordsList.length + "vertices";
			}
			return coordsList[2] - coordsList[0];
		};
	}

	function parseHref ( el ) {
		// Check for proper area
		if (el & el.nodeName == "area" || el.nodeName == "AREA") {
			if (el.href && el.href.length > 0) {
				return el.href;
			}
		}
	}

	function parseCoords ( el ) {
		var shape = determineShape(el);
		switch (shape) {
			case "rect":
				return parseRect(el);
			case "circ":
			case "poly":
				return parsePolyCoords(el);
		}
	}

})(Window);

//SVGM( "contentArea_pages_imgLeftPage" );