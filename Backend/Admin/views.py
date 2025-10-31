from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User,Group
from Accounts.serializers import UserSerializer
from Accounts.models import Roles
from django.contrib.auth.models import Permission
from Accounts import customPermissions 
from Accounts.customPermissions import AnyOfPermissions
# Create your views here.

@api_view(['GET'])
@permission_classes([IsAdminUser])
def whoAmI(request):
    user = request.user
    print(f"whoAmI called by user: {user}")
    if user.is_authenticated:
        return Response({"username": user.username, "email": user.email}, status=status.HTTP_200_OK)
    return Response({"message": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser,customPermissions.CanEditUser)])  # Only admins can assign roles
def assign_role(request):
    print(f"hello Admin :- {request.user}")
    # assign role of the user whose email
    print(request.data)
    try:
        emailOftheEmployee = request.data.get("email")
        roleToAssign = request.data.get("role")
        print(emailOftheEmployee + " --- "+roleToAssign)
        print(f"Assigning role '{roleToAssign}' to user with email: {emailOftheEmployee}")

        user = User.objects.filter(email=emailOftheEmployee).first()
        
        if user:
            if roleToAssign == None or roleToAssign.strip() == "":
                user.groups.clear()
                return Response({"message": "Roles removed from user successfully!"}, status=status.HTTP_200_OK)
            user.groups.clear()
            group = Group.objects.get(name=roleToAssign)
            user.groups.add(group)
            return Response({"message": "Role assigned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while assigning role."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser,customPermissions.CanAddRole)])
def addNewRole(request):
    try:
        print(request.data)
        role_name  = request.data.get('role', "").strip()
        print(f"Add New role '{role_name}'")
        if not role_name:
            return Response({"error": "Role name is required."}, status=status.HTTP_400_BAD_REQUEST)       
        group, created = Group.objects.get_or_create(name=role_name)
        if created:
            return Response({"message": f"Role :- '{role_name}' created successfully."},status=status.HTTP_201_CREATED)
        else:
            return Response({"message": f"Role :- '{role_name}' already exists."},status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while adding role."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanEditUser)])
def getAllUserList(request):
    user_data = []
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    for u in serializer.data:
        user_data.append(u)
    return Response(user_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanEditUser)])
def getAllRoleList(request):
    role_data = []
    roles = Group.objects.all()
    for role in roles:
        role_data.append({"name": role.name})
    return Response(role_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanEditUser)])  # Only admins can assign permissions
def assign_permissions(request):
    
    try:
        emailOftheEmployee = request.data.get("email")
        permissionsToAssign = request.data.get("permissions", [])

        print(f"Assigning permissions '{permissionsToAssign}' to user with email: {emailOftheEmployee}")
        # Fetch user
        user = User.objects.filter(email=emailOftheEmployee).first()
        if not user:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

        # Clear existing permissions
        user.user_permissions.clear()
        if len(permissionsToAssign) == 0:
            return Response({"message": "All permissions removed from user successfully!"}, status=status.HTTP_200_OK)
        # Assign new permissions
        for perm_codename in permissionsToAssign:
            try:
                permission = Permission.objects.get(codename=perm_codename)
                user.user_permissions.add(permission)
            except Permission.DoesNotExist:
                print(f"Permission with codename '{perm_codename}' does not exist.")
                continue

        return Response({"message": "Permissions assigned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while assigning permissions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanEditUser)])
def getAllPermissions(request):
    try:
        Account_permissions = Permission.objects.filter(content_type__app_label='Accounts').values( "id", "codename", "name", "content_type__app_label" )
        all_permissions = list(Account_permissions)
        Booking_permissions = Permission.objects.filter(content_type__app_label='Booking').values( "id", "codename", "name", "content_type__app_label" )
        all_permissions += list(Booking_permissions)
        Rooms_permissions = Permission.objects.filter(content_type__app_label='Rooms').values( "id", "codename", "name", "content_type__app_label" )
        all_permissions += list(Rooms_permissions)
        # all_permissions = Permission.objects.all().values( "id", "codename", "name", "content_type__app_label" )
        print("type check for all_permissions:")
        print(type(all_permissions))
        return Response({"permissions": list(all_permissions)}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response(
            {"message": "An error occurred while fetching permissions."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanEditUser)])  # Only admins can see user roles
def userpermissions(request):
    try:
        emailOftheEmployee = request.data.get("email")
        print(f"Fetching permissions for user with email: {emailOftheEmployee}")

        # Fetch user
        user = User.objects.filter(email=emailOftheEmployee).first()
        if not user:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

        user_perms = user.user_permissions.all().values(
            "id", "codename", "name", "content_type__app_label"
        )
        print(f"User permissions: {list(user_perms)}")
        return Response({"user_permissions": list(user_perms)}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response(
            {"message": "An error occurred while fetching user permissions."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser,customPermissions.CanEditUser)])  # Only admins can see user roles
def getUserRole(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
        roles = user.groups.values_list('name', flat=True)
        return Response({"roles": list(roles)}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AnyOfPermissions(IsAdminUser, customPermissions.CanDeleteUser)])  # Only admins can delete users
def deleteUser(request):
    try:
        emailOftheEmployee = request.data.get("email")
        print(f"Deleting user with email: {emailOftheEmployee}")

        user = User.objects.filter(email=emailOftheEmployee).first()
        if user:
            user.delete()
            return Response({"message": "User deleted successfully!"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(f"Error occurred: {e}")
        return Response({"message": "An error occurred while deleting user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
