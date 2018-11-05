import React, {
    Component
} from 'react';

class Map extends Component {
    styles = {
        errorLine1: {
            fontSize: '2em',
            color: 'red',
            textAlign: 'center'
        },
        errorLine2: {
            fontSize: '1.75em',
            textAlign: 'center'

        }
    };

    render() {

        if (this.props.error === null) {
            return ( 
              <div id = 'map'
                role = 'application'
                aria-label = 'map' /> 
            )
        } else {
            return ( 
              <div >
                <p style = {this.styles.errorLine1} > 
                  {this.props.error.message} 
                </p>
                <p style = {this.styles.errorLine2} >
                    Try again later 
                </p>
            </div>
            )
        }
    }

}

export default Map;