import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

// To eliminate warning about material-ui using the deprecated typography
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class SideBar extends Component {
    // "ListDrawer discussion begins at 25:00"
        //return '<div><strong>Hello</strong></div>';
    state = {
        open: false,
        query: ''
    }

    render() {
        console.log('Locations passed to SideBar', this.props.locations);
        return(
            <div>
                <Drawer  open={this.props.open} onClose={this.props.toggleSideBar}>  
                <ol>
                    <li> tom </li>
                    <li> dick </li>
                    <li> harry </li>
                </ol>   
                </Drawer>   
                    
            </div>
        )
        
    }
};

export default SideBar;