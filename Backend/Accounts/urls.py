from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', views.signup , name="signup"),
    # path('login/', views.login_view , name="login"), # session based login

    path('login/',TokenObtainPairView.as_view(),name='token_obtain_pair'), # JWT based login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), #

    path('profile/', views.profile , name="profile"),
    path('my-permissions/', views.myAllPermissions , name="my_permissions"),
    path('l/', views.login_view , name="login"),
    path('delete-account/', views.deleteAccount , name="deleteAccount"),
    path('delete-user-account/', views.deleteUserAccount , name="deleteUserAccount"),
    path("filter-users/", views.filterUser, name="filter_users"),
]