from django.urls import path
from .views import (
    register, CreateLeagueView, MyLeaguesView, PublicLeaguesView,
    join_league, joined_leagues, search_leagues
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('create-league/', CreateLeagueView.as_view(), name='create-league'),
    path('my-leagues/', MyLeaguesView.as_view(), name='my-leagues'),
    path('public-leagues/', PublicLeaguesView.as_view(), name='public-leagues'),
    path('join-league/<int:league_id>/', join_league, name='join-league'),
    path('joined-leagues/', joined_leagues, name='joined-leagues'),

    # 🔍 Search endpoint
    path('search-leagues/', search_leagues, name='search-leagues'),
]
