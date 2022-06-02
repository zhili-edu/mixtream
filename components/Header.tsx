import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
    return (
        <AppBar
            position="sticky"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <Typography variant="h5">Mixtream</Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
