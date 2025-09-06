import django_filters
from django.contrib.auth.models import User

class UserFilters(django_filters.FilterSet):
    email = django_filters.CharFilter(field_name='email', lookup_expr='icontains')
    username = django_filters.CharFilter(field_name='username', lookup_expr='icontains')
    first_name = django_filters.CharFilter(field_name='first_name', lookup_expr='icontains')
    last_name = django_filters.CharFilter(field_name='last_name', lookup_expr='icontains')
    roles = django_filters.CharFilter(field_name='groups__name', lookup_expr='icontains')
    is_active = django_filters.BooleanFilter(field_name='is_active')

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'roles', 'is_active']