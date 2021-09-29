import {createMuiTheme} from "@material-ui/core";

function createTheme(primary, secondary) {
    return createMuiTheme({
        palette: {
            primary: Object.assign({}, primary, {
                // special primary color rules can be added here
            }),
            secondary: Object.assign({}, secondary, {
                // special secondary color rules can be added here
            }),
            // error: will use the default color
        },
        spacing: 0,
        overrides:{
            MuiButton: {
                root: {
                    background: secondary.main
                }
            }
        }
    });


}

export default (createTheme);


