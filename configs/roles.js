const roles = {
    member: {
      can: [],
    },
    contributor: {
      can: ['create_tasks', 'update_own_tasks', 'delete_own_tasks'],
    },
    editor: {
      can: ['create_tasks', 'update_any_tasks', 'delete_any_tasks'],
    },
    projectManager: {
      can: ['create_tasks', 'update_any_tasks', 'delete_any_tasks', 'assign_tasks', 'manage_team_settings'],
    },
    admin: {
      can: ['manage_everything'],
    },
    creator: {
      can: ['manage_everything'],
    },
  };
  
module.exports = roles;
  