import React from "react";
import Timergui from "./Timergui";
import AppBar from '@mui/material/AppBar';
import ToolBar from '@mui/material/ToolBar';
import Typography from '@mui/material/Typography';

function App() {

    return(<>
    <AppBar position="sticky" style={{ background: "#2E3B55" }}>
      <ToolBar>
        <Typography>Counter</Typography>
      </ToolBar>
    </AppBar>
            <Timergui countdown="50"/><hr/><br/>
            </>);
}

export default App;