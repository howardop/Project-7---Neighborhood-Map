import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

// To eliminate material-ui warning about using the deprecated typography
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class SideBar extends Component {
    // "ListDrawer discussion begins at 25:00"
      
    state = {
        open: false,
        query: '',
    }

    // Called each time a character is added to or deleted from the seach field.
    updateQuery = (query) => {
        console.log(`query is: ${query}`);
        // Update the input box
        this.setState({query});

        // Pass control to App.js to process the SideBar and the markers
        this.props.updateQuery(query);
    }

    styles = {
        list: {
            width: "200px",
            padding: "0px 15px 0px"
        },
        noBullets: {
            listStyleType: "none"
            ,padding: 0
        },
        fullList: {
            width: 'auto'
        },
        listItem: {
            marginBottom: "15px"
        },
        listLink: {
            background: "transparent",
            border: "none",
            color: "black"
        },
        filterEntry: {
            border: "1px solid gray",
            padding: "3px",
            margin: "30px 0px 10px"
            /*width: "100%"*/
        }
    };

    render() {
        //console.log('SideBar being processed');
        return(
            <div>
                <Drawer  open={this.props.open} onClose={this.props.toggleSideBar} width={'30%'}>  
                    <div style={this.styles.list}>
                        <input
                            type = "text"
                            placeholder = "Search for Theater"
                            value = {this.state.query}
                            onChange = {(event) => {
                                this.updateQuery(event.target.value);
                            }}
                            style = {this.styles.filterEntry}
                        />            
                        <ul >
                            {this.props.filteredLocations &&
                            this.props.filteredLocations.map((filteredLocation, index) => {
                                
                                return (
                                    <li key={index}>
                                        <button style={this.styles.listLink} key={index} onClick={e => this.props.clickListItem(filteredLocation.globalIndex)}>{filteredLocation.name}</button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Drawer>           
            </div>
        )      
    }
};

export default SideBar;