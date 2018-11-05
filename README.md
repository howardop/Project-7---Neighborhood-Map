# Neighborhood Map Project
## Inroduction

The Neighborhood Map project is a single page application displaying the Broadway theater district in New York City.  The theaters displayed, and the information presented, are all obtained from  Foursquare (https://foursquare.com).  In addition to highlighting the Broadway theaters on the map, it provides a list of the theaters displayed with allows the user to search for a particular theater by name.  

This application will also supports offline use once the map appears in the browser. 

## Installing and Starting Neighborhood Map
1. Clone https://github.com/howardop/Project-7---Neighborhood-Map.git
2. Cd to Project-7---Neighborhood-Map/
3. Execute `npm install`
4. Execute `npm start`
5. The home page will open in a tab with the title `Neighborhood Map` with the url http://localhost:3000  
6. Thereafter, you can start Neighborhood Map by simply typing `npm start`.  

### Building Neighborhood Map for production
__Note:__ The default service worker is used in Neighborhood Map.  Because Neighborhood App is bootstrapped using Create React App, the service worker will only work in a production build.  

To create the production build, follow these instructions from the Create React App README: 

Execute `npm run build` or `yarn build`.
This builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.


## Using Neigborhood Map
When the web page opens, markers appear for each Broadway theater in New York City.
1.  The `theater name` will appear by hovering the mouse over a marker.
2.  The `theater's name an address` will appear in an infoWindow when the marker is clicked.  The marker will also bounce when clicked (and stop bouncing when clicked again);
3.  Clicking on the hamburger icon in the left side of the title banner causes a `sidebar` to open on the left side of the web page displaying a list of all the theaters displayed in the map.
    1. Clicking a name in the list will cause the appropriate marker to bounce and its infoWindow to open above it.
4.  The sidebar also provides a search box at the top which supports incremental searching of the theaters.  Typing any part of a theater name will filter out those theaters which do not match;   only those theaters whose names contain the string in the search box will be listed.
    1.  In addition, only the names in the sidebar will be marked in the map.   


## Services included in the implementation of Neighborhood Map
1. [Create React App](https://github.com/facebookincubator/create-react-app) used to bootstrap the implementation.
2. [react-native-fetch-polyfill](https://github.com/robinpowered/react-native-fetch-polyfill) provides a fetch function with a timeout feature used to handle web page timeouts.
3. [material-ui](https://material-ui.com/) provides the Drawer component used to implement the sidebar.

