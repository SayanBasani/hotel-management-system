from django.db import models

# Create your models here.

class Roles(models.Model):
    name = models.CharField(max_length=255,unique=True)
    description = models.TextField(max_length=1000,blank=True,null=True)
    permissions = models.TextField(max_length=2000,blank=True,null=True)

    def __str__(self):
        return self.name
    
class Permissions(models.Model):
    name = models.CharField(max_length=255)
    class Meta:
        permissions=[
            ("can_delete_user", "Can delete user"),
            ("can_view_user", "Can view user"),

            ("can_add_user", "Can add user"),
            ("can_edit_user", "Can edit user"),
            # ("can_delete_user", "Can delete user"),
            # ("can_view_user", "Can view user"),


            ("can_add_room", "Can add room"),
            ("can_edit_room", "Can edit room"),
            ("can_delete_room", "Can delete room"),
            ("can_view_room", "Can view room"),

            
            ("can_add_booking", "Can add booking"),
            ("can_edit_booking", "Can edit booking"),
            ("can_delete_booking", "Can delete booking"),
            ("can_view_booking", "Can view booking"),


            ("can_add_role", "Can add role"),
            ("can_delete_role", "Can delete role"),
            ("can_view_role", "Can view role"),
        ]