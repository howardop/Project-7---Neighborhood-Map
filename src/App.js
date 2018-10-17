import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map.js'

const defaultCenter = {
  // Broadway and W46th St
  lat: 40.7579984,
  lng: -73.9856257
};

const defaultZoom = 13;

class App extends Component {
  state = {
    locations: [],
    selectedMarkerIndex: -1,
    center: defaultCenter,
    zoom: defaultZoom    
  }

  componentDidMount() {
    this.getLocations();
  }
/*
  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: defaultCenter,
      zoom: defaultZoom
    });
  }
*/
  getLocations = () => {
    // Look for theaters on Broadway
    const url = "https://api.foursquare.com/v2/venues/search?ll=40.7579984,%20-73.9856257&radius=150&intent=browse&client_id=DQ4DTQOWUBJMWTFUFL4YXGDHMV0K4TE13IHYDFJPER15UTJB&client_secret=A3ZVRPXB2ENUSG5EG5BZM0UYVR1JW33TUXQKX2TGSJRB2B4W&v=20181001&query=theater";
    let theaters = [];
    console.log(`On entry to getLocations, "this" is `, this);
    fetch(url)
      .then( (response) => {
        console.log(`In fetch.then(response), "this" is `, this);
        console.log('Data returned');
        return response.json();
      })
      .then ((data) => {
        console.log(`In fetch.then(data), "this" is `, this);
        this.setState({locations: data.response.venues});
        console.log(`There are ${this.state.locations.length} items returned`);
        // Foursquare returns more than just theaters
        let theaters = this.state.locations.filter(function (value, index, array) {
          console.log(`Name is ${value.name}.  Type=${value.categories[0].name}.` );
          if (value.categories[0].name == 'Theater') {
            console.log("value.categories[0].name == 'Theater' is ", (value.categories[0].name == 'Theater'));
          }
          return value.categories[0].name == 'Theater';
          //return value.categories[0].name.endsWith('Theater');
        });
        console.log(`There are ${theaters.length} real theaters`);
        console.log(`the theaters are `);
        for (let i=0; i<theaters.length; i++) {
          console.log(theaters[i].name);
        }
        this.setState({locations: theaters}, this.addMarkers());
        console.log(`the theaters state.locations are `);
        for (let i=0; i<theaters.length; i++) {
          console.log(`${i+1}. `, this.state.locations[i].name);
        }
        
      });
 
  }

  addMarkers = () => {
    console.log(`Locations have been loaded into local state`);
    
    this.state.locations.map(theater => {
      console.log(`This theater is ${theater.name}`);
    })
    
  }

  handleMarkerClickEvent = (event, latlng, index) => {
    this.setState({
      selectMarkerIndex: index,
      center: latlng // the clicked or selected marker latlng
    });
  }

  handleInfoWindowCloseEvent = (event) => {
    // Reset the state values to the default
    this.setState({
      selectedMarkerIndex: -1,
      center: defaultCenter,  // the default latlng for the application
      zoom: defaultZoom
    })
  }
/*
  // we want both of the components to refer to the same funciton inside App.js
  <ListPlaces onKeyPressed=this.handleMarkerClickEvent 
    locationArray={// Locations or venues that we get from Foursquare API} />
  <Map onMarkerClick=this.handleMarkerClickEvent />

  <Map role='application'>
    // the marker click will be done from inside CompositeMAPUsingReact
    <CompositeMAPUsingReact onMarkerClick=this.props.onMarkerClick />
  </Map>
*/

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Neighborhood Map</h1>
        </header>
        <Map locations={this.state.locations} />
       </div>
    );
  }
}

export default App;
