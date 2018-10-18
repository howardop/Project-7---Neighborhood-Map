import React, { Component } from 'react'
import './App.css';

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
    this.renderMap();
    this.getLocations();
  }

  renderMap = () => {
    addGoogleApiScriptTag('https://maps.googleapis.com/maps/api/js?key=AIzaSyAubhdURq6tefzCuxspVifGrzXFveOM4Fg&callback=initMap');
    window.initMap = this.initMap;
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center:  defaultCenter,
      zoom: defaultZoom
    });
  }

  addMarkers = () => {
    console.log(`Locations have been loaded into local state`);
    
    this.state.locations.map(theater => {
      console.log(`This theater is ${theater.name}`);
    })
    
  }
  getLocations = () => {
    // Look for theaters on Broadway
    const url = "https://api.foursquare.com/v2/venues/search?ll=40.7579984,%20-73.9856257&radius=150&intent=browse&client_id=DQ4DTQOWUBJMWTFUFL4YXGDHMV0K4TE13IHYDFJPER15UTJB&client_secret=A3ZVRPXB2ENUSG5EG5BZM0UYVR1JW33TUXQKX2TGSJRB2B4W&v=20181001&query=theater";
    
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
          if (value.categories[0].name === 'Theater') {
            console.log("value.categories[0].name === 'Theater' is ", (value.categories[0].name === 'Theater'));
          }
          return value.categories[0].name === 'Theater';
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

  
  render() {
    return (
      <main>
        <div className = "App" >
          <header className = "App-header" >
            <h1 className = "App-title" > Neighborhood Map </h1> 
          </header> 
        <div id = 'map' > </div>  
        </div> 
      </main>
    );
  };
}

function addGoogleApiScriptTag(url) {
  let index = window.document.getElementsByTagName('script')[0];
  let script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
};

export default App;
