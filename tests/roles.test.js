// Load required modules
require('../js/app.js');
require('../js/roles.js');

describe('RoleManager', () => {
  beforeEach(() => {
    RoleManager.init();
  });

  describe('Role Initialization', () => {
    test('should create default roles when none exist', () => {
      localStorage.getItem.mockReturnValue(null);
      
      RoleManager.init();
      
      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorage.setItem.mock.calls[0][1];
      const roles = JSON.parse(savedData);
      
      expect(roles).toHaveLength(3);
      expect(roles[0].name).toBe('Work');
      expect(roles[1].name).toBe('Personal');
      expect(roles[2].name).toBe('Family');
    });

    test('should load existing roles from localStorage', () => {
      const existingRoles = [
        { id: 'custom', name: 'Custom Role', color: '#ff0000' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(existingRoles));
      
      RoleManager.init();
      
      const allRoles = RoleManager.getAllRoles();
      expect(allRoles).toHaveLength(1);
      expect(allRoles[0].name).toBe('Custom Role');
    });
  });

  describe('Role Management', () => {
    test('should add new role', () => {
      localStorage.getItem.mockReturnValue('[]');
      
      document.getElementById('role-name').value = 'New Role';
      document.getElementById('role-color').value = '#ff0000';
      
      RoleManager.addRole();
      
      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorage.setItem.mock.calls[0][1];
      const roles = JSON.parse(savedData);
      
      expect(roles).toHaveLength(1);
      expect(roles[0].name).toBe('New Role');
      expect(roles[0].color).toBe('#ff0000');
    });

    test('should not add role without name', () => {
      localStorage.getItem.mockReturnValue('[]');
      
      document.getElementById('role-name').value = '';
      document.getElementById('role-color').value = '#ff0000';
      
      RoleManager.addRole();
      
      // Should not save anything since name is empty
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should delete role by ID', () => {
      const existingRoles = [
        { id: 'role1', name: 'Role 1', color: '#ff0000' },
        { id: 'role2', name: 'Role 2', color: '#00ff00' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(existingRoles));
      
      RoleManager.init();
      RoleManager.deleteRole('role1');
      
      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = localStorage.setItem.mock.calls[0][1];
      const roles = JSON.parse(savedData);
      
      expect(roles).toHaveLength(1);
      expect(roles[0].id).toBe('role2');
    });
  });

  describe('Role Retrieval', () => {
    beforeEach(() => {
      const testRoles = [
        { id: 'work', name: 'Work', color: '#4285f4' },
        { id: 'personal', name: 'Personal', color: '#34a853' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testRoles));
      RoleManager.init();
    });

    test('should get role by ID', () => {
      const role = RoleManager.getRoleById('work');
      
      expect(role).toBeDefined();
      expect(role.name).toBe('Work');
      expect(role.color).toBe('#4285f4');
    });

    test('should return undefined for non-existent role', () => {
      const role = RoleManager.getRoleById('nonexistent');
      
      expect(role).toBeUndefined();
    });

    test('should get all roles', () => {
      const allRoles = RoleManager.getAllRoles();
      
      expect(allRoles).toHaveLength(2);
      expect(allRoles[0].name).toBe('Work');
      expect(allRoles[1].name).toBe('Personal');
    });
  });

  describe('Role ID Generation', () => {
    test('should generate unique role IDs', () => {
      localStorage.getItem.mockReturnValue('[]');
      RoleManager.init();
      
      // Add multiple roles with similar names
      document.getElementById('role-name').value = 'Test Role';
      RoleManager.addRole();
      
      document.getElementById('role-name').value = 'Test Role';
      RoleManager.addRole();
      
      const allRoles = RoleManager.getAllRoles();
      expect(allRoles).toHaveLength(2);
      expect(allRoles[0].id).toBe('test_role');
      expect(allRoles[1].id).toBe('test_role_1');
    });
  });

  describe('Modal Management', () => {
    test('should open role management modal', () => {
      RoleManager.openRoleModal();
      
      const modal = document.getElementById('role-modal');
      expect(modal.classList.contains('open')).toBe(true);
    });
  });
}); 