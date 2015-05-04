QUnit.test("SVG Conversion", function ( assert ) {

	// Run the SVG converter
	// In this case, we know there should only be two image maps on screen
	// A more robust test would run this on the entirety of the page
	var svg1 = new SVGM();

	// Create a generic map element for testing
	var mapEl1 = document.createElement("map");
	mapEl1.setAttribute("id", "map1");

	assert.equal(svg1.getAttributeValue(mapEl1, "id"), "map1");

	// Create a generic anchor element
	var anchor = document.createElement("a");
	anchor.href = "http://www.google.com";

	// Create an area that is supposed to be a rect
	var testRectArea = document.createElement("area");
	testRectArea.setAttribute("href", "http://www.google.com");
	testRectArea.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	testRectArea.setAttribute("shape", "rect");

	var newAnchor = svg1.createSVGAnchor(anchor);
	assert.equal(newAnchor.tagName, "a");
	assert.notEqual(newAnchor.href.baseVal, "http://www.google.com");
	assert.equal(newAnchor.href.baseVal, "http://www.google.com/");
	assert.equal(svg1.createSVGAnchor(testRectArea).href.baseVal, "http://www.google.com/");

	var testImage1 = document.createElement("img");
	testImage1.setAttribute("id", "testimage1");
	testImage1.setAttribute("usemap", "#map1");

	document.body.appendChild(testImage1);
	document.body.appendChild(mapEl1);

	var testImage1Map = svg1.getMapFromImage(testImage1);
	assert.equal(testImage1Map.tagName, "MAP");
	assert.equal(testImage1Map.getAttribute("id"), "map1");

	// Use the area rect shape created earlier
	var newShapeObject = svg1.parseRect(testRectArea);
	assert.equal(newShapeObject.x, "105.061764705882");
	assert.equal(newShapeObject.y, "7.14705882352941");
	assert.equal(newShapeObject.type, "rect");
	assert.equal(newShapeObject.height, 17.15294117647059);
	assert.equal(newShapeObject.width, 230.135294117647);

	// Create a bunch of area elements with different shapes
	var areaRect = document.createElement("area");
	areaRect.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaRect.setAttribute("shape", "rect");

	var areaRectangle = document.createElement("area");
	areaRectangle.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaRectangle.setAttribute("shape", "rectangle");

	var areaPoly = document.createElement("area");
	areaPoly.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaPoly.setAttribute("shape", "poly");

	var areaPolygon = document.createElement("area");
	areaPolygon.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaPolygon.setAttribute("shape", "polygon");

	var areaCirc = document.createElement("area");
	areaCirc.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaCirc.setAttribute("shape", "circ");

	var areaCircle = document.createElement("area");
	areaCircle.setAttribute("coords", "105.061764705882,7.14705882352941,335.197058823529,24.3");
	areaCircle.setAttribute("shape", "circle");

	assert.equal(svg1.determineShape(areaRect), "rect");
	assert.equal(svg1.determineShape(areaRectangle), "rect");
	assert.equal(svg1.determineShape(areaPoly), "poly");
	assert.equal(svg1.determineShape(areaPolygon), "poly");
	assert.equal(svg1.determineShape(areaCirc), "circ");
	assert.equal(svg1.determineShape(areaCircle), "circ");



	//var svgMap1 = assert.equal( SVGM( "contentArea_pages_Image2" ), true, "Map found" );
	//var svgMap2 = assert.equal( SVGM( "contentArea_pages_Image1" ), false, "There was no map associated with this image" );
	////TODO: Expand testing on the functions themselves not just the results if they had run successfully
	//var maps = document.querySelectorAll( "map" );
	//assert.ok( maps.length == 0, "All the maps have dissappeared" );
	//svgMap1.parentNode.removeChild(svgMap1);
	//svgMap2.parentNode.removeChild(svgMap2);

});