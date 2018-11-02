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

// Hide points of interest that otherwise clutter up the map
var myStyles =[
  {
      featureType: "poi",
      elementType: "labels",
      stylers: [
            { visibility: "off" }
      ]
  }
];

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
    open: false,     // Indicates if sidebar is visible   
    query: '' 
  }

  componentDidMount() {
    this.getLocations();
  }

  initMap = (theaters) => {
    /*let map = new window.google.maps.Map(document.getElementById('map'), {
      center:  defaultCenter,
      zoom: defaultZoom
    });*/
    let map = new window.google.maps.Map(document.getElementById('map'), myOptions);

    // Now set up InfoWindow to be shared by each marker
    let infoWindow = new window.google.maps.InfoWindow();
 
    // this is pointing to window here
    // Add marker for each theater found
    let markers = theaters.map(theater => {
      //console.log(theater.location.formattedAddress);
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
        console.log('marker.addListener called');
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });

      // Include return statement to avoid eslint message
      return marker;

    });

    console.log('About to put theaters and markers into state');
    this.setState({
      map: map,
      locations: theaters,
      filteredLocations: theaters,
      markers: markers
    });
    

  }

  getLocations = () => {
    // Look for theaters on Broadway
    const theaterCategoryId = '4bf58dd8d48988d137941735'; 
    
    const url = `https://api.foursquare.com/v2/venues/search?ll=40.7579984,%20-73.9856257&radius=250&intent=browse&client_id=DQ4DTQOWUBJMWTFUFL4YXGDHMV0K4TE13IHYDFJPER15UTJB&client_secret=A3ZVRPXB2ENUSG5EG5BZM0UYVR1JW33TUXQKX2TGSJRB2B4W&v=20181001&categoryId=${theaterCategoryId}`;
    
    // this points to App here
    //console.log(`On entry to getLocations, "this" is `, this);
    fetch(url)
      .then( (response) => {
        //console.log(`In fetch.then(response), "this" is `, this);
        //console.log('Data returned');
        return response.json();
      })
      .then ((data) => {
        // this points to App here
        //console.log(`In fetch.then(data), "this" is `, this);

        // Foursquare returns more than just theaters
        let theaters = data.response.venues.filter(function (value, index, array) {
          return (value.name.includes('Theater') || value.name.includes('Theatre'));
        });
        /*
        console.log(`There are ${theaters.length} real theaters`);
        console.log(`the theaters are `);
        for (let i=0; i<theaters.length; i++) {
          console.log(theaters[i].name);
        }
        */

        // Update state with real theaters and create map
        this.setState({locations: theaters, filteredLocations: theaters}, function() {
          // Cannot not just pass initMap(), must pass a function that calls initMap()
          this.initMap(theaters);
        });
        /*
        console.log(`the theaters in state.locations are `);
        for (let i=0; i<theaters.length; i++) {
          console.log(`${i+1}. `, this.state.locations[i].name);
        }  
        */
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
    this.setState({open: !this.state.open});
  }

  closeSideBar = () => {
    this.setState({open: false});
  }

  filterMarkers = (filterArray) => {
    console.log('filterMarkers called');
    let markers = this.state.markers;
    for (let i=0; i<filterArray.length; i++) {
      markers[i].setVisible(filterArray[i]);
    }
    this.setState({markers});
  }
  
  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "black",
      color: 'white',
      padding: 10
    },
    hamburger: {
      fontSize: '2em'
    }
  };

  clickListItem = (index) => {
    // Set the state to reflect the selected location array index
    //this.setState({ selectedIndex: index, open: !this.state.open })
    console.log(`${this.state.locations[index].name} clicked`);
    console.log(`Need to click marker ${this.state.markers[index].title}`);
    window.google.maps.event.trigger(this.state.markers[index], 'click');
    // Need to close SideBar
    this.closeSideBar();
    let mev = {
      stop: null,
      latlng: defaultCenter
    }
    window.google.maps.event.trigger(this.state.map, 'click', mev);
  }

  updateQuery = (query) => {
    console.log(`query is: ${query}`);
    
    let filteredLocations = this.state.locations.filter((loc, index, array) => {
        return loc.name.toLowerCase().includes(query.toLowerCase());
    })

    console.log('filteredLocations = ', filteredLocations);
    this.setState({ query, filteredLocations});
    
  }

  
  render() {
    return (
      <main>
        
        <div className="App-header">
          <button onClick={this.toggleSideBar} style={this.styles.menuButton}>
            <i className="fa fa-bars" style={this.styles.hamburger} ></i>
          </button>
          <h1 className='App-title'><center>Broadway Theater Map</center></h1>
        </div>
           
          <SideBar id='sidebar' locations={this.state.filteredLocations}
          open={this.state.open} 
          toggleSideBar={this.toggleSideBar}
          clickListItem={this.clickListItem}
          updateQuery={this.updateQuery}
           />

          <div id = 'map' role='application' aria-label='map'> </div>  
       
      </main>
    );
  };
}

export default App;
