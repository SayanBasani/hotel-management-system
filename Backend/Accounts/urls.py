from django.urls import path
from . import views
urlpatterns = [
    path('signup/', views.signup , name="signup"),
    path('login/', views.login_view , name="login"),
    path('profile/', views.profile , name="profile"),
    path('', views.login_view , name="login"),
    path('delete-account/', views.deleteAccount , name="deleteAccount"),
    path('delete-user-account/', views.deleteUserAccount , name="deleteUserAccount"),
    path("filter-users/", views.filterUser, name="filter_users")
]
