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
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

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
    const [oldState, setOld] = useState<
        'active' | 'inactive' | 'forbid' | undefined
    >(undefined);

    const { data } = useLiveState(appName, name);

    useEffect(() => {
        if (data) {
            if (oldState === 'active' && data.state === 'inactive') {
                toast.error(`${name} 已断流`);
            }
            if (oldState && oldState !== 'active' && data.state === 'active') {
                toast.success(`${name} 开始推流`);
            }
            setOld(data.state);
        }
    }, [data]);

    return (
        <ListItem key={name} selected={selected} disablePadding>
            <ListItemButton onClick={onClick}>
                {data ? (
                    <ListItemIcon>
                        {data.state === 'active' ? (
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
