from django.contrib import admin
from django.urls import path,include
from Accounts import views as account_views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('Account/', include('Accounts.urls')), 
    path('Master/', include('Admin.urls')), 
    path('Rooms/', include('Rooms.urls')), 
    path('', account_views.profile , name="profile"),

    path('api/Account/', include('Accounts.urls')), 
    path('api/Master/', include('Admin.urls')), 
    path('api/Rooms/', include('Rooms.urls')), 
]
