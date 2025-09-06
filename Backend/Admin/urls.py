from django.urls import path
from . import views
urlpatterns = [
    path('allusers/', views.getAllUserList , name="allusers"),
    path('allroles/', views.getAllRoleList , name="allroles"),
    path('addrole/', views.addNewRole , name="addrole"),
    path('assignrole/', views.assign_role , name="assignrole"),
    path('assignpermissions/', views.assign_permissions , name="assignpermissions"),
    path('', views.getAllUserList , name="adminPanel"),
    path('whoami/', views.whoAmI , name="whoami"),
]
