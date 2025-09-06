from rest_framework.permissions import BasePermission

class CanAddRoom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_add_room')

class CanEditRoom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_edit_room')

class CanDeleteRoom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_delete_room')

class CanViewRoom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_view_room')

class CanBookRoom(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_add_booking')

class CanEditBooking(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_edit_booking')

class CanDeleteBooking(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_delete_booking')
        
class CanViewBooking(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm('Accounts.can_view_booking')
