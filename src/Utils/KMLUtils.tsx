import { DOMParser, DOMImplementation, XMLSerializer, } from 'xmldom';
import * as RNFS from 'react-native-fs';

// Raw string to create the base kml document/object
const emptyKML = '<?xml version="1.0" encoding="UTF-8"?>\n' + '<kml xmlns="http://www.opengis.net/kml/2.2">\n' + '<Document>\n' + '</Document>\n' + '</kml>';

// Appends a text node to an existing kml document
function appendNode (doc: Document, parentElement: Node, nodeName: string) {
    // Create the new node
    let childElement = doc.createElement(nodeName);
    // Add the node
    parentElement.appendChild(childElement);
    // Return the newly created node
    return childElement;
}

// Appends a text node to an existing kml document
function appendTextNode (doc: Document, parentElement: Node, nodeName: string, text: string) {
    // Create the new text node
    let childElement = doc.createElement(nodeName);
    if (typeof(text) !== undefined) {
        // Create the new text node
        let textNode = doc.createTextNode(text);
        // Append the new text node
        childElement.appendChild(textNode);
    }
    // Append the new object to the document
    parentElement.appendChild(childElement);
    // Return the newly created node
    return childElement;
}

// Creates a default kml document
export function CreateDefaultKMLDoc(docName: string): Document {
    // Create default kml object based on the empty kml string
    let doc = new DOMParser().parseFromString(emptyKML);

    // Add name element to document
    // Get root element
    let rootElement = doc.documentElement;
    // Get document object
    let docElement = rootElement.getElementsByTagName('Document')[0];

    // Add name element
    appendTextNode(doc, docElement, 'name', docName);
    // Return newly created document
    return doc;
}

// Adds a new reading to the kml document
export function AddPointToKML(doc: Document, pointName: string, description: string, coords: string) {
    // Get root element of document
    let rootElement = doc.documentElement;
    // Get document element
    let docElement = rootElement.getElementsByTagName('Document')[0];

    // Add a placemark element to hold object
    let placemarkElement = appendNode(doc, docElement, 'Placemark');
    // Add name to point
    appendTextNode(doc, placemarkElement, 'name', pointName);
    // Add description
    appendTextNode(doc, placemarkElement, 'description', description);
    // Add coords
    let pointElement = appendNode(doc, placemarkElement, 'Point');
    // Add location data to point
    appendTextNode(doc, pointElement, 'coordinates', coords);
}

export function UpdateKMLPath(doc: Document, description: string, pointsArray: string[]) {
    // Get root element of document
    let rootElement = doc.documentElement;
    // Get document element
    let docElement = rootElement.getElementsByTagName('Document')[0];

    // Get all placemark elements
    let placemarks = docElement.getElementsByTagName('Placemark');

    // Remove the last placemark from the document
    if (placemarks.length > 1) {
        docElement.removeChild(placemarks[placemarks.length - 2]);
    }

    // Add a path element
    let placemarkElement = appendNode(doc, docElement, 'Placemark');
    // Add name element to the path
    appendTextNode(doc, placemarkElement, 'name', 'Path');
    // Add a description to the path
    appendTextNode(doc, placemarkElement, 'description', description);
    // Add line element
    let lineElement = appendNode(doc, placemarkElement, 'LineString');
    // Add the coordinates element
    appendTextNode(doc, lineElement, 'coordinates', pointsArray.join('\n'));
}

// A track is used to describe how an entity moves through the world over time
export function UpdateKMLTrack(doc: Document, description: string, pointsTimeMap: any) {
    // Get root element of document
    let rootElement = doc.documentElement;
    // Get document element
    let docElement = rootElement.getElementsByTagName('Document')[0];

    // Get the track element
    let trackElement = docElement.getElementsByTagName('gx:Track');
}

export function ConvertToString(doc: Node) {
    return new XMLSerializer().serializeToString(doc);
}

export async function writeKMLFile(kmlDoc: Document, dir: string, fileName: string) {
    // Check if the file exists
    let exists = await RNFS.exists(dir);

    // If the directory does not exist, make directory
    if (exists == false) {
        // Make the directory
        await RNFS.mkdir(dir);
    }

    // Write updated KML document to file
    await RNFS.writeFile(dir + fileName, ConvertToString(kmlDoc), );

    //console.log('Finished writing kml file: ', dir + fileName);
}

export default { CreateDefaultKMLDoc, AddPointToKML, ConvertToString, writeKMLFile, UpdateKMLPath, };