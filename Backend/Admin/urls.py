from django.urls import path
from . import views
urlpatterns = [
    path('allusers/', views.getAllUserList , name="allusers"),
    path('allroles/', views.getAllRoleList , name="allroles"),
    path('addrole/', views.addNewRole , name="addrole"),
    path('assignRoleToUser/', views.assign_role , name="assignRoleToUser"),
    path('assignpermissions/', views.assign_permissions , name="assignpermissions"),
    path('userpermissions/', views.userpermissions , name="userpermissions"),
    path('', views.getAllUserList , name="adminPanel"),
    path('whoami/', views.whoAmI , name="whoami"),
    path('permissions_list/', views.getAllPermissions , name="permissions_list"),
    path('getUserRole/',views.getUserRole , name="getUserRole"),
    path('deleteUser/',views.deleteUser , name="deleteUser"),
]
