from django.contrib import admin
from .models import Roles
from django.contrib.auth.models import Permission

# Register your models here.

admin.site.register(Roles)
admin.site.register(Permission)
