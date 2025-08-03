# Material-UI Component Guide

## Overview
This guide maps specific UI elements to Material-UI v5 components, providing implementation patterns and best practices for the team todo application.

## Component Architecture

### Theme Configuration
```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase
        },
      },
    },
  },
});
```

## Authentication Components

### Login/Signup Forms
```typescript
// Email Input
<TextField
  fullWidth
  label="Email"
  type="email"
  variant="outlined"
  error={!!errors.email}
  helperText={errors.email}
  InputProps={{
    startAdornment: <EmailIcon />
  }}
/>

// OTP Input Component
<MuiOtpInput
  length={6}
  value={otp}
  onChange={setOtp}
  TextFieldsProps={{
    type: 'number',
    placeholder: '-',
  }}
/>

// Submit Button
<LoadingButton
  fullWidth
  variant="contained"
  loading={isSubmitting}
  loadingPosition="start"
  startIcon={<LoginIcon />}
>
  Continue
</LoadingButton>
```

### Multi-Step Forms
```typescript
// Stepper Component
<Stepper activeStep={activeStep}>
  <Step>
    <StepLabel>Enter Email</StepLabel>
  </Step>
  <Step>
    <StepLabel>Verify Code</StepLabel>
  </Step>
  <Step>
    <StepLabel>Create Account</StepLabel>
  </Step>
</Stepper>
```

## Layout Components

### App Shell
```typescript
// Responsive App Bar with Team Switcher
<AppBar position="fixed">
  <Toolbar>
    <IconButton edge="start" onClick={toggleDrawer}>
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      {currentTeam.name}
    </Typography>
    <TeamSwitcher />
    <UserMenu />
  </Toolbar>
</AppBar>

// Navigation Drawer
<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={drawerOpen}
  onClose={toggleDrawer}
  sx={{
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }}
>
  <DrawerContent />
</Drawer>
```

### Team Switcher Component
```typescript
<FormControl size="small">
  <Select
    value={currentTeamId}
    onChange={handleTeamSwitch}
    displayEmpty
    renderValue={(value) => (
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {currentTeam.name[0]}
        </Avatar>
        <Typography>{currentTeam.name}</Typography>
      </Box>
    )}
  >
    <MenuItem>
      <TextField
        placeholder="Search teams..."
        size="small"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      />
    </MenuItem>
    <Divider />
    {teams.map((team) => (
      <MenuItem key={team.id} value={team.id}>
        <ListItemText primary={team.name} />
        <Chip size="small" label={team.role} />
      </MenuItem>
    ))}
    <Divider />
    <MenuItem onClick={createNewTeam}>
      <AddIcon /> Create New Team
    </MenuItem>
  </Select>
</FormControl>
```

## Data Display Components

### Todo Lists View
```typescript
// For smaller datasets - use List
<List>
  {todos.map((todo) => (
    <ListItem
      key={todo.id}
      secondaryAction={
        <IconButton edge="end">
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </ListItemIcon>
      <ListItemText
        primary={todo.title}
        secondary={
          <Box display="flex" gap={1} alignItems="center">
            <Chip size="small" label={todo.assignee} />
            {todo.dueDate && (
              <Chip
                size="small"
                label={formatDate(todo.dueDate)}
                color={isPastDue(todo.dueDate) ? 'error' : 'default'}
              />
            )}
          </Box>
        }
      />
    </ListItem>
  ))}
</List>

// For larger datasets - use DataGrid
<DataGrid
  rows={todos}
  columns={columns}
  pageSize={25}
  checkboxSelection
  disableSelectionOnClick
  components={{
    Toolbar: CustomToolbar,
  }}
/>
```

### Cards for Todo Lists
```typescript
<Card sx={{ height: '100%' }}>
  <CardActionArea onClick={() => navigateToList(list.id)}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {list.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {list.description}
      </Typography>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Chip
          size="small"
          label={`${list.activeCount} active`}
          color="primary"
          variant="outlined"
        />
        <AvatarGroup max={3}>
          {list.contributors.map((user) => (
            <Avatar key={user.id} alt={user.name}>
              {user.name[0]}
            </Avatar>
          ))}
        </AvatarGroup>
      </Box>
    </CardContent>
  </CardActionArea>
  <CardActions>
    <IconButton size="small">
      <EditIcon />
    </IconButton>
    <IconButton size="small">
      <ArchiveIcon />
    </IconButton>
  </CardActions>
</Card>
```

## Form Components

### Data Input Drawers (Desktop & Mobile)

```typescript
// Responsive Drawer Component
const ResponsiveDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({ 
  open, 
  onClose, 
  children 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <SwipeableDrawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 400,
          maxHeight: isMobile ? '90vh' : '100vh',
          borderRadius: isMobile ? '16px 16px 0 0' : 0,
        }
      }}
    >
      {/* Drag Handle for Mobile */}
      {isMobile && (
        <Box
          sx={{
            width: 40,
            height: 4,
            bgcolor: 'grey.300',
            borderRadius: 2,
            mx: 'auto',
            my: 1,
          }}
        />
      )}
      {children}
    </SwipeableDrawer>
  );
};

// Todo Creation Drawer
<ResponsiveDrawer open={open} onClose={onClose}>
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {/* Header */}
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Create New Todo</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Box>
    
    {/* Content */}
    <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
      <Stack spacing={3}>
        <TextField
          label="Title"
          fullWidth
          required
          autoFocus
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        
        <Autocomplete
          options={teamMembers}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Assignee" />
          )}
          value={formData.assignee}
          onChange={(_, value) => setFormData({ ...formData, assignee: value })}
        />
        
        <DatePicker
          label="Due Date"
          value={formData.dueDate}
          onChange={(date) => setFormData({ ...formData, dueDate: date })}
          renderInput={(params) => <TextField {...params} />}
        />
        
        <ToggleButtonGroup
          value={formData.priority}
          exclusive
          onChange={(_, priority) => setFormData({ ...formData, priority })}
          fullWidth
        >
          <ToggleButton value="low">Low</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="high">High</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Box>
    
    {/* Footer */}
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={!formData.title}
        >
          Create Todo
        </Button>
      </Stack>
    </Box>
  </Box>
</ResponsiveDrawer>
```

## Feedback Components

### Notifications
```typescript
// Success/Error Snackbar
<Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <Alert
    onClose={handleClose}
    severity={snackbar.severity}
    variant="filled"
  >
    {snackbar.message}
  </Alert>
</Snackbar>

// Confirmation Dialog
<Dialog open={confirmDialog.open} onClose={handleCancel}>
  <DialogTitle>
    {confirmDialog.title}
  </DialogTitle>
  <DialogContent>
    <DialogContentText>
      {confirmDialog.message}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancel}>Cancel</Button>
    <Button 
      onClick={handleConfirm} 
      color="error"
      variant="contained"
    >
      {confirmDialog.confirmText}
    </Button>
  </DialogActions>
</Dialog>
```

### Loading States
```typescript
// Skeleton for Lists
<Box>
  {[...Array(5)].map((_, index) => (
    <Skeleton
      key={index}
      variant="rectangular"
      height={60}
      sx={{ mb: 1, borderRadius: 1 }}
    />
  ))}
</Box>

// Full Page Loading
<Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <CircularProgress color="inherit" />
</Backdrop>
```

## Mobile Responsive Patterns

### Responsive Grid
```typescript
<Grid container spacing={3}>
  {items.map((item) => (
    <Grid item xs={12} sm={6} md={4} key={item.id}>
      <ItemCard item={item} />
    </Grid>
  ))}
</Grid>
```

### Mobile-First Navigation
```typescript
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

{isMobile ? (
  <BottomNavigation value={currentTab} onChange={handleTabChange}>
    <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
    <BottomNavigationAction label="Todos" icon={<ListIcon />} />
    <BottomNavigationAction label="Team" icon={<GroupIcon />} />
  </BottomNavigation>
) : (
  <Tabs value={currentTab} onChange={handleTabChange}>
    <Tab label="Dashboard" />
    <Tab label="Todos" />
    <Tab label="Team" />
  </Tabs>
)}
```

## Performance Optimizations

### Virtualized Lists
```typescript
import { VariableSizeList } from 'react-window';

<VariableSizeList
  height={600}
  itemCount={todos.length}
  itemSize={getItemSize}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <TodoItem todo={todos[index]} />
    </div>
  )}
</VariableSizeList>
```

### Lazy Loading
```typescript
const TodoDetails = lazy(() => import('./TodoDetails'));

<Suspense fallback={<CircularProgress />}>
  <TodoDetails todoId={selectedTodoId} />
</Suspense>
```

## Accessibility Enhancements

### ARIA Labels
```typescript
<IconButton
  aria-label="delete todo"
  onClick={handleDelete}
>
  <DeleteIcon />
</IconButton>

<TextField
  label="Search todos"
  inputProps={{
    'aria-label': 'search todos',
    'aria-describedby': 'search-helper-text'
  }}
  helperText="Search by title or assignee"
/>
```

### Focus Management
```typescript
const firstFieldRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (open) {
    firstFieldRef.current?.focus();
  }
}, [open]);
```

## Drawer Patterns for Different Use Cases

### List Creation Drawer
```typescript
<ResponsiveDrawer open={open} onClose={onClose}>
  <DrawerHeader title="Create New List" onClose={onClose} />
  <DrawerContent>
    <Stack spacing={3}>
      <TextField
        label="List Name"
        fullWidth
        required
        autoFocus
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <ColorPicker
        label="List Color"
        value={color}
        onChange={setColor}
      />
    </Stack>
  </DrawerContent>
  <DrawerFooter>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="contained" onClick={handleCreate}>
      Create List
    </Button>
  </DrawerFooter>
</ResponsiveDrawer>
```

### Team Invite Drawer
```typescript
<ResponsiveDrawer open={open} onClose={onClose}>
  <DrawerHeader title="Invite Team Member" onClose={onClose} />
  <DrawerContent>
    <Stack spacing={3}>
      <FormControl>
        <FormLabel>Role</FormLabel>
        <RadioGroup value={role} onChange={(e) => setRole(e.target.value)}>
          <FormControlLabel value="member" control={<Radio />} label="Member" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>
      </FormControl>
      
      {inviteLink ? (
        <>
          <TextField
            label="Invite Link"
            value={inviteLink}
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={copyToClipboard}>
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
          />
          <Alert severity="info">
            This link expires in 7 days
          </Alert>
        </>
      ) : (
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={generateLink}
        >
          Generate Invite Link
        </Button>
      )}
    </Stack>
  </DrawerContent>
</ResponsiveDrawer>
```

## Best Practices

1. **Component Composition**: Build smaller, reusable components
2. **Theme Consistency**: Use theme spacing, colors, and typography
3. **Responsive Design**: Test on multiple breakpoints
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Test with keyboard navigation and screen readers
6. **Error Boundaries**: Wrap features in error boundaries
7. **Code Splitting**: Split by route and feature
8. **State Management**: Keep server state in React Query, UI state in Zustand

### Drawer-Specific Best Practices

1. **Consistent Behavior**: All data input uses drawers, not dialogs
2. **Focus Management**: Auto-focus first input when drawer opens
3. **Mobile Gestures**: Enable swipe down to close on mobile
4. **Backdrop Clicks**: Allow closing via backdrop click unless form is dirty
5. **Keyboard Support**: ESC key closes drawer, Enter submits (when valid)
6. **Loading States**: Disable form during submission, show progress
7. **Error Handling**: Show inline errors, keep drawer open on error
8. **Animation**: Use consistent slide transitions (300ms duration)