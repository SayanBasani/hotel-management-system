from rest_framework.permissions import BasePermission

def AnyOfPermissions(*perms):
    """
    Factory that returns a permission class checking if ANY of the provided
    permissions pass.
    """
    class _AnyOfPermissions(BasePermission):
        def has_permission(self, request, view):
            return any(perm().has_permission(request, view) for perm in perms)
    return _AnyOfPermissions



class CanAddUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_add_user')

class CanEditUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_edit_user')

class CanDeleteUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_delete_user')

class CanViewUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_view_user')
    
class CanAddRole(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_add_role')
    
class CanDeleteRole(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_delete_role')
    