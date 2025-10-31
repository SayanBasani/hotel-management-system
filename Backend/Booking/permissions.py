from rest_framework.permissions import BasePermission


# ---- Booking Permissions ----

class CanAddBooking(BasePermission):
    """Allow users with permission to add/book a room."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm('Accounts.can_add_booking')
        )


class CanEditBooking(BasePermission):
    """Allow users with permission to edit booking details."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm('Accounts.can_edit_booking')
        )


class CanDeleteBooking(BasePermission):
    """Allow users with permission to cancel or delete a booking."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm('Accounts.can_delete_booking')
        )


class CanViewBooking(BasePermission):
    """Allow users with permission to view booking information."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm('Accounts.can_view_booking')
        )


