import {
  Home as HomeIcon,
  FormatListBulleted as ListIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui-store';

const drawerWidth = 240;

const menuItems = [
  { key: 'dashboard', text: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { key: 'todo-lists', text: 'Todo Lists', icon: <ListIcon />, path: '/lists' },
  { key: 'team', text: 'Team', icon: <PeopleIcon />, path: '/team' },
  { key: 'search', text: 'Search', icon: <SearchIcon />, path: '/search' },
  { key: 'activity', text: 'Activity', icon: <NotificationsIcon />, path: '/activity' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isSidebarOpen}
      sx={{
        width: isSidebarOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                data-testid={`sidebar-${item.key}`}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
}