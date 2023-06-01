import React from "react";
import { AppBar, Typography, Toolbar, Button, Card, CardHeader, CardActions, CardActionArea } from "@mui/material";

export function AssemblyApp(): JSX.Element {
    return (<>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Robot manager
                </Typography>
            </Toolbar>
        </AppBar>
        <Card>
            <CardHeader title="Auto assembly" />
            <CardActions>
                <Button color="primary">
                    Execute
                </Button>
            </CardActions>
        </Card>
    </>);
}