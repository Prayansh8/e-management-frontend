import { MenuItem, Popover } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

export const TenantPopover = (props) => {
  const { setSelectedRole } = useAuth();
  const { anchorEl, onChange, onClose, open = false, tenants, ...other } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 180 } }}
      {...other}>
      {tenants.map((tenant) => (
        <MenuItem
          key={tenant}
          onClick={() => setSelectedRole(tenant)}
        >
          {tenant}
        </MenuItem>
      ))}
    </Popover>
  );
};
