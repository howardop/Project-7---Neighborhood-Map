import React, { Component } from 'react'
import './App.css';
import './components/SideBar.css';
import SideBar from './components/SideBar';
import Map from './components/Map';
import fetch from 'react-native-fetch-polyfill';

const defaultCenter = {
  // Broadway and W45th St
  lat: 40.7579984,
  lng: -73.9856257
};
const defaultZoom = 17;

// Hide points of interest that otherwise clutter up the map
var myStyles = [{
  featureType: "poi",
  elementType: "labels",
  stylers: [{
    visibility: "off"
  }]
}];

var myOptions = {
  zoom: defaultZoom,
  center: defaultCenter,
  mapTypeId: window.google.maps.MapTypeId.ROADMAP,
  styles: myStyles
};



class App extends Component {
  state = {
    locations: [],
    filteredLocations: [],
    center: defaultCenter,
    zoom: defaultZoom,
    markers: [],
    open: false,          // Indicates if sidebar is visible   
    query: '',            // Value used to filter items in SideBar
    bouncingMarker: null, // Index of bouncing marker
    error: null,           // Holds error object if data cannot be retrieved
    infoWindow: null,
    infoWindowOpen: false
  }

  componentDidMount() {
    this.getLocations();
  }

  getLocations = () => {
    // Look for theaters on Broadway
    const theaterCategoryId = '4bf58dd8d48988d137941735';

    const url = `https://api.foursquare.com/v2/venues/search?ll=40.7579984,%20-73.9856257&radius=250&intent=browse&client_id=DQ4DTQOWUBJMWTFUFL4YXGDHMV0K4TE13IHYDFJPER15UTJB&client_secret=A3ZVRPXB2ENUSG5EG5BZM0UYVR1JW33TUXQKX2TGSJRB2B4W&v=20181001&categoryId=${theaterCategoryId}`;

    fetch(url, {timeout: 1 * 1000})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Foursquare returns more than just theaters.  Filter out non-theaters
        let theaters = data.response.venues.filter(function (value, index, array) {
          return (value.name.includes('Theater') || value.name.includes('Theatre'));
        });

        // Update state with real theaters and create map
        this.setState({
          locations: theaters,
          filteredLocations: theaters
        }, function () {
          // Cannot not just pass initMap(), must pass a function that calls initMap()
          this.initMap(theaters);
        });
      })
      .catch((error) => {
        this.setState({
          error
        });
      })
  }

  initMap = (theaters) => {
    let map = new window.google.maps.Map(document.getElementById('map'), myOptions);

    // Now set up InfoWindow to be shared by each marker
    let infoWindow = new window.google.maps.InfoWindow();

    // Stop bouncing marker is infoWidow is closed
    window.google.maps.event.addListener(infoWindow, 'closeclick', () => {
      let bouncingMarker = this.state.bouncingMarker;
      let markers = this.state.markers;
      if (bouncingMarker !== null) {
        markers[bouncingMarker].setAnimation(null);
      }
      this.setState({
        markers: markers,
        bouncingMarker: null,
        infoWindowOpen: false
      });
    });

    // Add marker for each theater found
    let markers = theaters.map((theater, index) => {
      let contentString = `<strong>${theater.name}</strong><br> ${theater.location.address}<br><small>&#40;Theater data provided by Foursquare.&#41;</small>`;
      let marker = new window.google.maps.Marker({
        position: {
          lat: theater.location.lat,
          lng: theater.location.lng
        },
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: theater.name,
        globalIndex: index
      });
      theater.marker = marker; // Link marker to its theater
      theater.globalIndex = index; // Global index is index in unfiltered array.  It is used as an invariant with the markers array

      // Set up Listener for each marker to display InfoWindow when user clicks on marker
      marker.addListener('click', () => {
        markers = this.state.markers;

        // Stop any currently bouncing marker
        let bouncingMarker = this.state.bouncingMarker;
        let newBouncer = null;
        if (bouncingMarker !== null) { 
          markers[bouncingMarker].setAnimation(null);
        } 
        if (marker.globalIndex !== bouncingMarker) {
          // Set content for specific marker
          infoWindow.setContent(contentString);
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          infoWindow.open(map, marker);
          newBouncer = marker.globalIndex;
        }
        // Remember which marker is bouncing
        this.setState({
          bouncingMarker: newBouncer, infoWindowOpen: true});
      });

      // Include return statement to avoid eslint message
      return marker;

    });

    this.setState({
      map: map,
      locations: theaters,
      filteredLocations: theaters,
      markers: markers,
      infoWindow: infoWindow
    });
   };

  toggleSideBar = () => {
    // Close any bouncing marker
    let bouncingMarker = this.state.bouncingMarker;
    let markers = this.state.markers;
    let infoWindowOpen = this.state.infoWindowOpen;
    if (bouncingMarker !== null) {
      markers[bouncingMarker].setAnimation(null);
      bouncingMarker = null;
      if (infoWindowOpen){
        this.state.infoWindow.close();
      }
      
    this.setState({
      open: !this.state.open, infoWindowOpen: false, bouncingMarker: bouncingMarker,
      markers: markers
    });
    } else {
      this.setState({
        open: !this.state.open
      });
    }
  }

  closeSideBar = () => {
    this.setState({
      open: false
    });
  }

  clickListItem = (index) => {
    window.google.maps.event.trigger(this.state.markers[index], 'click');

    // Close SideBar after a theater is chosen.  Do this by progammatically clicking map
    this.closeSideBar();
    let mev = {
      stop: null,
      latlng: defaultCenter
    }
    window.google.maps.event.trigger(this.state.map, 'click', mev);
  }

  updateQuery = (query) => {
    let markers = this.state.markers;
    let map = this.state.map;
    let filteredLocations = this.state.locations.filter((loc, index, array) => {
      let toInclude = loc.name.toLowerCase().includes(query.toLowerCase());
      markers[index].setVisible(toInclude);

      return toInclude;
    })
    // Center map to first item in list
    let newLat = filteredLocations[0].location.lat;
    let newLng = filteredLocations[0].location.lng;
    map.setCenter({
      lat: newLat,
      lng: newLng
    })
    this.setState({
      filteredLocations,
      map,
      markers
    });

  }
  render() {
    return (
      <main>
        
        <div className="App-header">
          <button id='sidebarButton' tabIndex='0' onClick={this.toggleSideBar} >
            <i className="fa fa-bars"  ></i>
          </button>
          <h1 className='App-title'><center>Broadway Theater Map</center></h1>
        </div>
          
        <SideBar id='sidebar' filteredLocations={this.state.filteredLocations}
          open={this.state.open} 
          toggleSideBar={this.toggleSideBar}
          clickListItem={this.clickListItem}
          updateQuery={this.updateQuery}
        />
        <Map error={this.state.error} />
      
       
      </main>
    );
  };
}

export default App;

