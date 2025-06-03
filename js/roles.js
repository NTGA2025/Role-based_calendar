// Roles module for handling role management
const RoleManager = (() => {
    // Private variables
    let roles = [];
    
    // Initialize roles manager
    function init() {
        // Load roles from localStorage
        loadRoles();
        
        // Populate role filter dropdown
        populateRoleFilter();
    }
    
    // Load roles from localStorage
    function loadRoles() {
        const storedRoles = localStorage.getItem('calendar_roles');
        if (storedRoles) {
            roles = JSON.parse(storedRoles);
        } else {
            // Create default roles if none exist
            roles = [
                { id: 'work', name: 'Work', color: '#4285f4' },
                { id: 'personal', name: 'Personal', color: '#34a853' },
                { id: 'family', name: 'Family', color: '#fbbc05' }
            ];
            saveRoles();
        }
    }
    
    // Save roles to localStorage
    function saveRoles() {
        localStorage.setItem('calendar_roles', JSON.stringify(roles));
    }
    
    // Open role management modal
    function openRoleModal() {
        const modal = document.getElementById('role-modal');
        
        // Render roles list
        renderRolesList();
        
        // Reset add role form
        document.getElementById('add-role-form').reset();
        
        // Show the modal
        modal.classList.add('open');
    }
    
    // Render the list of roles in the modal
    function renderRolesList() {
        const rolesList = document.getElementById('roles-list');
        rolesList.innerHTML = '';
        
        roles.forEach(role => {
            const roleItem = document.createElement('div');
            roleItem.className = 'role-item';
            
            const roleNameColor = document.createElement('div');
            roleNameColor.className = 'role-name-color';
            
            const roleColor = document.createElement('div');
            roleColor.className = 'role-color';
            roleColor.style.backgroundColor = role.color;
            
            const roleName = document.createElement('span');
            roleName.textContent = role.name;
            
            roleNameColor.appendChild(roleColor);
            roleNameColor.appendChild(roleName);
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-role';
            deleteButton.innerHTML = '&times;';
            deleteButton.setAttribute('data-role-id', role.id);
            deleteButton.addEventListener('click', () => {
                deleteRole(role.id);
            });
            
            roleItem.appendChild(roleNameColor);
            roleItem.appendChild(deleteButton);
            
            rolesList.appendChild(roleItem);
        });
    }
    
    // Add a new role
    function addRole() {
        const roleName = document.getElementById('role-name').value;
        const roleColor = document.getElementById('role-color').value;
        
        if (!roleName) return;
        
        const newRole = {
            id: generateRoleId(roleName),
            name: roleName,
            color: roleColor
        };
        
        roles.push(newRole);
        saveRoles();
        
        // Update UI
        renderRolesList();
        populateRoleFilter();
        
        // Reset form
        document.getElementById('add-role-form').reset();
    }
    
    // Delete a role
    function deleteRole(roleId) {
        // Filter out the role to delete
        roles = roles.filter(role => role.id !== roleId);
        
        // Save updated roles
        saveRoles();
        
        // Update UI
        renderRolesList();
        populateRoleFilter();
    }
    
    // Populate the role filter dropdown
    function populateRoleFilter() {
        const roleSelect = document.getElementById('role-select');
        
        // Clear existing options except the first one
        while (roleSelect.options.length > 1) {
            roleSelect.remove(1);
        }
        
        // Add role options
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    }
    
    // Get a role by ID
    function getRoleById(roleId) {
        return roles.find(role => role.id === roleId);
    }
    
    // Get all roles
    function getAllRoles() {
        return [...roles];
    }
    
    // Generate a role ID from name
    function generateRoleId(name) {
        // Convert name to lowercase and replace spaces with underscores
        const baseId = name.toLowerCase().replace(/\s+/g, '_');
        
        // Check if this ID already exists
        const existingRole = roles.find(role => role.id === baseId);
        if (!existingRole) {
            return baseId;
        }
        
        // If ID exists, add a number suffix
        let counter = 1;
        let newId = `${baseId}_${counter}`;
        
        while (roles.find(role => role.id === newId)) {
            counter++;
            newId = `${baseId}_${counter}`;
        }
        
        return newId;
    }
    
    // Public API
    return {
        init,
        openRoleModal,
        addRole,
        deleteRole,
        getRoleById,
        getAllRoles
    };
})(); 