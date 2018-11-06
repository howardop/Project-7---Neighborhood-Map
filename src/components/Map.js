import React, { Component } from 'react';
import './Map.css';

class Map extends Component {

    render() {

        if (this.props.error === null) {
            return ( 
              <div id = 'map'
                role = 'application'
                aria-label = 'map' /> 
            )
        } else {
            return ( 
              <div id='errorMessage'>
                <p id='errorLine1' > 
                  {this.props.error.message}.
                </p>
                <p id='errorLine2' >
                    Try again later. 
                </p>
            </div>
            )
        }
    }

}

export default Map;