import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useStore } from '../pages/_app';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useLiveState } from '../api/live';

const StreamListItem = ({
    name,
    selected,
    onClick,
}: {
    name: string;
    selected: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
    const appName = useStore((state) => state.appName);

    const { data, error } = useLiveState(appName, name);

    return (
        <ListItem key={name} selected={selected} disablePadding>
            <ListItemButton onClick={onClick}>
                {data ? (
                    <ListItemIcon>
                        {data.StreamState === 'active' ? (
                            <CheckCircleIcon color="success" />
                        ) : (
                            <StopCircleIcon color="error" />
                        )}
                    </ListItemIcon>
                ) : null}
                <ListItemText primary={name} />
            </ListItemButton>
        </ListItem>
    );
};

export default StreamListItem;
