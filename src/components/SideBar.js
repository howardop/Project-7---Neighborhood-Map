import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

class SideBar extends Component {
    // "ListDrawer discussion begins at 25:00"
        //return '<div><strong>Hello</strong></div>';
    state = {
        open: false,
        query: ''
    }

    render() {
        return(
            <div>
                <Drawer  open='true' variant='temporary' onClose={this.props.toggleDrawer}>  
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