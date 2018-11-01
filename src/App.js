import React, { Component } from 'react'
import './App.css';
import './components/SideBar.css';
import SideBar from './components/SideBar';

const defaultCenter = {
  // Broadway and W45th St
  lat: 40.7579984,
  lng: -73.9856257
};

const defaultZoom = 17;



class App extends Component {
  state = {
    locations: [],
    selectedMarkerIndex: -1,
    center: defaultCenter,
    zoom: defaultZoom,
    markers: [],
    open: false     // Indicates if sidebar is visible    
  }

  componentDidMount() {
    this.getLocations();
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center:  defaultCenter,
      zoom: defaultZoom
    });

    // Now set up InfoWindow to be shared by each marker
    let infoWindow = new window.google.maps.InfoWindow();
 
    // this is pointing to window here
    // Add marker for each theater found
    let markers = this.state.locations.map(theater => {
      console.log(theater.location.formattedAddress);
      let contentString = `<strong>${theater.name}</strong><br /> ${theater.location.address}`;
      let marker = new window.google.maps.Marker({
        position: {
          lat: theater.location.lat,
          lng: theater.location.lng
        },
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: theater.name
      });

      // Set up Listener for each marker to display InfoWindow when user clicks on marker
      marker.addListener('click', function () {
      // Set content for specific marker
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
      });

      // Include return statement to avoid eslint message
      return markers;
    });

    this.setState({
      map: map,
      markers: markers,
      google: window.google
    });
  }

  getLocations = () => {
    // Look for theaters on Broadway
    // Use explore instead of search?
    const url = "https://api.foursquare.com/v2/venues/search?ll=40.7579984,%20-73.9856257&radius=150&intent=browse&client_id=DQ4DTQOWUBJMWTFUFL4YXGDHMV0K4TE13IHYDFJPER15UTJB&client_secret=A3ZVRPXB2ENUSG5EG5BZM0UYVR1JW33TUXQKX2TGSJRB2B4W&v=20181001&query=theater";
    
    // this points to App here
    console.log(`On entry to getLocations, "this" is `, this);
    fetch(url)
      .then( (response) => {
        console.log(`In fetch.then(response), "this" is `, this);
        console.log('Data returned');
        return response.json();
      })
      .then ((data) => {
        // this points to App here
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

        // Update state with real theaters and create map
        this.setState({locations: theaters}, function() {
          // Cannot not just pass initMap(), must pass a function that calls initMap()
          this.initMap();
        });
        
        console.log(`the theaters in state.locations are `);
        for (let i=0; i<theaters.length; i++) {
          console.log(`${i+1}. `, this.state.locations[i].name);
        }  
      });
 
      /*
      filterlocs(str) {
        let f = str ? 
          this.locations.filter(v => {
            v.name.toLowerCase().includes(str.toLowerCase())}) : this.locations;
        // Now filter out markers
        // for loop supposedly much faster than Array.forEach()
        for (let i=0; i<markers.length; i++) {
          if (markers[i].name.toLowerCase().includes(str.toLowerCase()) {
            markers[i].setvisible(true);
          } else {
            markers[i].setvisible(false);
          }
        });
        this.setState({filtered: v});
      }
      */
  }

  toggleSideBar = () => {
    console.log('toggleSideBar called');
    this.setState({open: !this.state.open});
  }

  closeSideBar = () => {
    console.log('closeSideBar called');
    this.setState({open: false});
  }
  
  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "white",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };
  
  render() {
    return (
      <main>
        
        <div className = "App-header">
          <button onClick={this.toggleSideBar} style={this.styles.menuButton}>
            Display Menu
            <i className="fa fa-bars"></i>
          </button>
          <h1 className='App-title'><center>Broadway Theater Map</center></h1>
        </div>
           
          <SideBar locations={this.state.locations}
          open={this.state.open} 
          toggleSideBar={this.toggleSideBar}
          close={this.closeSideBar}/>

          <div id = 'map' > </div>  
       
      </main>
    );
  };
}

export default App;
