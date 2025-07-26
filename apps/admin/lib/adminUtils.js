// Log admin actions for audit trail
export const logAdminAction = async (
	adminId,
	action,
	resourceType,
	resourceId = null,
	details = {}
) => {
	try {
		// Log to console for now - can be extended to use API route later
		console.log('Admin Action:', {
			adminId,
			action,
			resourceType,
			resourceId,
			details: {
				...details,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('Error logging admin action:', error);
	}
};

// Check if admin has permission for specific action
export const checkAdminPermission = async (adminId, resource, action) => {
	try {
		// Get admin data to check their role
		const response = await fetch(
			`/api/admin/permissions?adminId=${adminId}`
		);
		const result = await response.json();

		if (!result.success) {
			console.error('Failed to fetch admin permissions:', result.error);
			return false;
		}

		const admin = result.admin;
		if (!admin || !admin.role) {
			return false;
		}

		// Get permissions for the admin's role
		const rolePermissions = getRolePermissions(admin.role);

		// Check if the role has permissions for the resource
		if (!rolePermissions[resource]) {
			return false;
		}

		// Check if the role has the specific action permission
		return rolePermissions[resource].includes(action);
	} catch (error) {
		console.error('Error checking admin permission:', error);
		return false;
	}
};

// Get admin role permissions
export const getRolePermissions = (role) => {
	const permissions = {
		SUPER_ADMIN: {
			projects: ['read', 'write', 'delete', 'approve', 'feature'],
			users: ['read', 'write', 'delete', 'suspend', 'award_watts'],
			discussions: ['read', 'write', 'delete', 'moderate'],
			content: ['read', 'write', 'delete', 'publish'],
			system: ['read', 'write', 'settings', 'backup'],
			admins: ['read', 'write', 'delete', 'role_management'],
		},
		ADMIN: {
			projects: ['read', 'write', 'approve', 'feature'],
			users: ['read', 'write', 'award_watts'],
			discussions: ['read', 'write', 'moderate'],
			content: ['read', 'write', 'publish'],
			system: ['read'],
			admins: ['read'],
		},
		MODERATOR: {
			projects: ['read', 'approve'],
			users: ['read'],
			discussions: ['read', 'write', 'moderate'],
			content: ['read'],
			system: ['read'],
			admins: ['read'],
		},
		SUPPORT: {
			projects: ['read'],
			users: ['read'],
			discussions: ['read', 'write'],
			content: ['read'],
			system: ['read'],
			admins: ['read'],
		},
	};

	return permissions[role] || permissions.SUPPORT;
};

// Get recent admin activities using API route
export const getRecentAdminActivities = async (limit = 50) => {
	try {
		const response = await fetch(`/api/admin/activities?limit=${limit}`);
		const result = await response.json();

		if (result.success) {
			return result.activities;
		} else {
			console.error('Failed to fetch admin activities:', result.error);
			return [];
		}
	} catch (error) {
		console.error('Error fetching admin activities:', error);
		return [];
	}
};

// Get admin statistics using API route
export const getAdminStats = async () => {
	try {
		const response = await fetch('/api/admin/stats');
		const result = await response.json();

		if (result.success) {
			return result.stats;
		} else {
			console.error('Failed to fetch admin stats:', result.error);
			return {
				totalUsers: 0,
				totalProjects: 0,
				actionsThisWeek: 0,
				activeAdminsCount: 0,
				actionBreakdown: {},
			};
		}
	} catch (error) {
		console.error('Error fetching admin stats:', error);
		return {
			totalUsers: 0,
			totalProjects: 0,
			actionsThisWeek: 0,
			activeAdminsCount: 0,
			actionBreakdown: {},
		};
	}
};

// Format admin action for display
export const formatAdminAction = (action, resourceType, details = {}) => {
	const actionMap = {
		PROJECT_APPROVED: 'approved project',
		PROJECT_REJECTED: 'rejected project',
		PROJECT_FEATURED: 'featured project',
		PROJECT_UNFEATURED: 'unfeatured project',
		USER_SUSPENDED: 'suspended user',
		USER_UNSUSPENDED: 'unsuspended user',
		WATTS_AWARDED: 'awarded watts',
		WATTS_REMOVED: 'removed watts',
		DISCUSSION_APPROVED: 'approved discussion',
		DISCUSSION_REJECTED: 'rejected discussion',
		CONTENT_PUBLISHED: 'published content',
		CONTENT_UNPUBLISHED: 'unpublished content',
		ADMIN_ADDED:
			details?.actionType === 'login'
				? 'logged in'
				: 'created admin account',
		SETTINGS_CHANGED: 'changed settings',
	};

	const baseAction =
		actionMap[action] || action.toLowerCase().replace(/_/g, ' ');

	if (details.projectTitle) {
		return `${baseAction} "${details.projectTitle}"`;
	}

	if (details.userName) {
		return `${baseAction} user "${details.userName}"`;
	}

	if (details.discussionTitle) {
		return `${baseAction} discussion "${details.discussionTitle}"`;
	}

	return baseAction;
};

// Check if admin has any permission for a resource
export const hasAnyPermission = async (adminId, resource) => {
	try {
		const response = await fetch(
			`/api/admin/permissions?adminId=${adminId}`
		);
		const result = await response.json();

		if (!result.success) {
			return false;
		}

		const admin = result.admin;
		if (!admin || !admin.role) {
			return false;
		}

		const rolePermissions = getRolePermissions(admin.role);
		return (
			!!rolePermissions[resource] && rolePermissions[resource].length > 0
		);
	} catch (error) {
		console.error('Error checking admin permissions:', error);
		return false;
	}
};

// Get all permissions for an admin
export const getAdminPermissions = async (adminId) => {
	try {
		const response = await fetch(
			`/api/admin/permissions?adminId=${adminId}`
		);
		const result = await response.json();

		if (!result.success) {
			return {};
		}

		const admin = result.admin;
		if (!admin || !admin.role) {
			return {};
		}

		return getRolePermissions(admin.role);
	} catch (error) {
		console.error('Error fetching admin permissions:', error);
		return {};
	}
};

// Check if admin is super admin
export const isSuperAdmin = async (adminId) => {
	try {
		const response = await fetch(
			`/api/admin/permissions?adminId=${adminId}`
		);
		const result = await response.json();

		if (!result.success) {
			return false;
		}

		const admin = result.admin;
		return admin?.role === 'SUPER_ADMIN';
	} catch (error) {
		console.error('Error checking super admin status:', error);
		return false;
	}
};
