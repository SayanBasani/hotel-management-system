from rest_framework.permissions import BasePermission

class CanDeleteUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_delete_user')

class CanViewUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_view_user')