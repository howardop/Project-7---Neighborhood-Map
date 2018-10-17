import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';



class Map extends Component {
 
 
  
   render() {
     /*
      console.log(`Inside Map component`);
    myThis.props.locations.map(theater => {
      console.log(`This theater is ${theater.name}`);
    })
    */
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { { lat: 40.756795, lng: -73.954298 } }
        defaultZoom = { 13 }
      >
      
      {/* {props.locations.map(theater => {
        console.log(`This theater is ${theater.name}`);
      })} */}
      
      </GoogleMap>
   ));
   
   
   return(
      <div>
        <GoogleMapExample
          containerElement={ <div style={{ height: `500px`, width: '1000px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
   );
   }
};
export default Map;