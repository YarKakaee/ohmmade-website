# OhmMade Admin System

A comprehensive role-based admin system with audit trails, permissions, and activity tracking for the OhmMade platform.

## Features

### 🔐 Role-Based Access Control

- **SUPER_ADMIN**: Full access to everything
- **ADMIN**: Can manage projects, users, content
- **MODERATOR**: Can moderate discussions, approve projects
- **SUPPORT**: Can view and respond to support requests

### 📊 Admin Dashboard

- Real-time activity feed
- Admin statistics and metrics
- Recent actions by all admins
- Role-based quick actions

### 📝 Audit Trail

- Complete logging of all admin actions
- IP address and user agent tracking
- Detailed action descriptions
- Timestamp tracking

### 🛡️ Security Features

- Database-based admin verification
- Session management
- Permission granularity
- Activity monitoring

## Database Schema

### Admin Table

```sql
- id: UUID (Primary Key)
- email: String (Unique)
- name: String
- role: AdminRole (SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT)
- isActive: Boolean
- lastLoginAt: DateTime
- avatar: String (Optional)
- bio: String (Optional)
- phone: String (Optional)
```

### AdminActionLog Table

```sql
- id: UUID (Primary Key)
- adminId: UUID (Foreign Key to Admin)
- action: AdminAction (Enum)
- resourceType: String
- resourceId: String (Optional)
- details: JSON
- ipAddress: String (Optional)
- userAgent: String (Optional)
- createdAt: DateTime
```

### AdminPermission Table

```sql
- id: UUID (Primary Key)
- adminId: UUID (Foreign Key to Admin)
- resource: String
- action: String
- granted: Boolean
- createdAt: DateTime
```

## Setup Instructions

### 1. Database Migration

First, run the Prisma migration to create the admin tables:

```bash
cd apps/admin
npx prisma migrate dev --name add-admin-system
```

### 2. Initialize Admin Users

Run the setup script to create initial admin accounts:

```bash
cd apps/admin
# Install dotenv if not already installed
pnpm add -D dotenv

# Run the setup script (choose one):
# Option 1: Using Prisma (recommended)
node scripts/setupAdminsPrisma.js

# Option 2: Using Supabase client
node scripts/setupAdmins.js
```

This will create admin accounts for:

- `admin@ohmmade.ca` (Primary admin)
- `yar@ohmmade.ca` (Co-founder)
- `serkan@ohmmade.ca` (Co-founder)
- `tristan@ohmmade.ca` (Co-founder)

### 3. Create Supabase Auth Accounts

You need to create Supabase auth accounts for each admin email. You can do this through:

- Supabase Dashboard → Authentication → Users → Add User
- Or programmatically using the Supabase API

### 4. Test Login

Try logging in with `admin@ohmmade.ca` to verify the system works.

## Usage

### Adding New Admins

1. Create a Supabase auth account for the new admin
2. Add the admin to the `Admin` table with appropriate role
3. Set up permissions in the `AdminPermission` table

### Logging Admin Actions

Use the `logAdminAction` utility function:

```javascript
import { logAdminAction } from '../lib/adminUtils';

// Log an action
await logAdminAction(adminId, 'PROJECT_APPROVED', 'Project', projectId, {
	projectTitle: 'My Project',
	reason: 'Approved for publication',
});
```

### Checking Permissions

Use the `checkAdminPermission` utility function:

```javascript
import { checkAdminPermission } from '../lib/adminUtils';

// Check if admin can approve projects
const canApprove = await checkAdminPermission(adminId, 'projects', 'approve');
```

## Admin Actions

The system tracks various admin actions:

### Project Management

- `PROJECT_APPROVED` - Project approved for publication
- `PROJECT_REJECTED` - Project rejected
- `PROJECT_FEATURED` - Project featured on homepage
- `PROJECT_UNFEATURED` - Project unfeatured
- `PROJECT_ARCHIVED` - Project archived
- `PROJECT_RESTORED` - Project restored from archive

### User Management

- `USER_SUSPENDED` - User account suspended
- `USER_UNSUSPENDED` - User account unsuspended
- `USER_DELETED` - User account deleted
- `USER_ROLE_CHANGED` - User role modified
- `WATTS_AWARDED` - Watts awarded to user
- `WATTS_REMOVED` - Watts removed from user

### Content Management

- `CONTENT_CREATED` - New content created
- `CONTENT_EDITED` - Content edited
- `CONTENT_DELETED` - Content deleted
- `CONTENT_PUBLISHED` - Content published
- `CONTENT_UNPUBLISHED` - Content unpublished

### Discussion Management

- `DISCUSSION_APPROVED` - Discussion approved
- `DISCUSSION_REJECTED` - Discussion rejected
- `DISCUSSION_CLOSED` - Discussion closed
- `DISCUSSION_REOPENED` - Discussion reopened
- `ANSWER_APPROVED` - Answer approved
- `ANSWER_REJECTED` - Answer rejected

### System Management

- `SETTINGS_CHANGED` - System settings modified
- `BACKUP_CREATED` - System backup created
- `MAINTENANCE_MODE_TOGGLED` - Maintenance mode enabled/disabled

### Admin Management

- `ADMIN_ADDED` - New admin added
- `ADMIN_REMOVED` - Admin removed
- `ADMIN_ROLE_CHANGED` - Admin role changed

## Role Permissions

### SUPER_ADMIN

- Full access to all resources
- Can manage other admins
- Can change system settings
- Can perform all actions

### ADMIN

- Can manage projects, users, content
- Can award/remove watts
- Can moderate discussions
- Cannot manage other admins

### MODERATOR

- Can approve/reject projects
- Can moderate discussions
- Can view user information
- Limited content management

### SUPPORT

- Can view projects and users
- Can respond to discussions
- Read-only access to most features
- No administrative actions

## Security Considerations

1. **Environment Variables**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is properly secured
2. **Database Access**: Use Row Level Security (RLS) policies in Supabase
3. **Session Management**: Implement proper session timeout
4. **IP Logging**: Monitor for suspicious login patterns
5. **Permission Auditing**: Regularly review admin permissions

## Future Enhancements

- [ ] Two-factor authentication for admins
- [ ] Admin activity reports and analytics
- [ ] Bulk operations for project/user management
- [ ] Email notifications for admin actions
- [ ] Advanced permission system with custom roles
- [ ] Admin performance metrics
- [ ] Integration with external audit systems

## Troubleshooting

### Common Issues

1. **Admin not found**: Ensure the email exists in both Supabase Auth and Admin table
2. **Permission denied**: Check if admin has the required role and permissions
3. **Action not logged**: Verify the `logAdminAction` function is called correctly
4. **Dashboard not loading**: Check database connection and table existence

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and check browser console for detailed error messages.

## Support

For issues or questions about the admin system, contact the development team or create an issue in the project repository.
