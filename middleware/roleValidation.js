// middleware/roleValidation.js
const VALID_ROLES = [
    'bdm',
    'estimator',
    'coo',
    'director',
    'design_lead',
    'designer',
    'accounts'
];

const ROLE_PERMISSIONS = {
    bdm: {
        proposals: ['create', 'read_own', 'update_own', 'delete_own', 'submit_to_client'],
        files: ['upload', 'read_own', 'delete_own'],
        projects: ['read_own'],
        payments: ['read']
    },
    estimator: {
        proposals: ['read', 'add_estimation'],
        files: ['upload', 'read'],
        projects: ['read'],
        tasks: ['read']
    },
    coo: {
        proposals: ['read', 'set_pricing'],
        projects: ['create', 'read', 'allocate', 'update'],
        tasks: ['create', 'read', 'assign'],
        files: ['read'],
        payments: ['read', 'update'],
        submissions: ['create', 'read', 'update']
    },
    director: {
        proposals: ['read', 'approve', 'reject'],
        projects: ['create', 'read', 'update', 'delete'],
        tasks: ['read'],
        files: ['read', 'delete'],
        payments: ['read', 'update'],
        submissions: ['read', 'update']
    },
    design_lead: {
        projects: ['read_assigned', 'update_assigned', 'assign_designers'],
        tasks: ['create', 'read', 'assign', 'review'],
        deliverables: ['read', 'review', 'approve'],
        submissions: ['create', 'read'],
        files: ['read']
    },
    designer: {
        projects: ['read_assigned'],
        tasks: ['read_assigned', 'update_assigned'],
        deliverables: ['upload', 'read_own', 'delete_own'],
        files: ['read_project']
    },
    accounts: {
        projects: ['read'],
        payments: ['create', 'read', 'update'],
        invoices: ['create', 'read', 'update', 'delete'],
        submissions: ['read']
    }
};

function hasPermission(role, resource, action) {
    if (!ROLE_PERMISSIONS[role]) return false;
    const permissions = ROLE_PERMISSIONS[role][resource];
    if (!permissions) return false;
    return permissions.includes(action);
}

function validateRole(role) {
    return VALID_ROLES.includes(role);
}

module.exports = {
    VALID_ROLES,
    ROLE_PERMISSIONS,
    hasPermission,
    validateRole
};
