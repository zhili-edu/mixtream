import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Toolbar,
} from '@mui/material';
import StreamListItem from './StreamListItem';
import { useMixes, useStreams } from '../api/live';

const Sidebar = ({
    stream,
    setStream,
}: {
    stream: string | null;
    setStream: (arg0: string | null) => void;
}) => {
    const { data: streams } = useStreams();
    const { data: mixes } = useMixes();

    const drawerWidth = 250;

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
        >
            <Toolbar />

            <List disablePadding>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => setStream(null)}>
                        <ListItemText
                            primary="控制台"
                            primaryTypographyProps={{ variant: 'h4' }}
                            secondary="Mixtream"
                        />
                    </ListItemButton>
                </ListItem>
                <Divider />

                <ListSubheader>混流</ListSubheader>
                {mixes?.map((mix) => (
                    <StreamListItem
                        key={mix.output}
                        name={mix.output}
                        selected={mix.output === stream}
                        onClick={(_e) =>
                            setStream(mix.output === stream ? null : mix.output)
                        }
                    />
                )) ?? null}
                <ListSubheader>输入流</ListSubheader>
                {streams?.names.map((name) => (
                    <StreamListItem
                        key={name}
                        name={name}
                        selected={name === stream}
                        onClick={(_e) =>
                            setStream(stream === name ? null : name)
                        }
                    />
                )) ?? null}
            </List>
        </Drawer>
    );
};

export default Sidebar;
