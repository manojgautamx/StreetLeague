from django.urls import path
from .views import (register, CreateLeagueView, MyLeaguesView, PublicLeaguesView,join_league, joined_leagues, ChatView, update_league, delete_league, leave_league, league_participants_view, search_leagues
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
urlpatterns = [
    path('register/', register, name='register'),  
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('create-league/', CreateLeagueView.as_view(), name='create-league'),
    path('my-leagues/', MyLeaguesView.as_view(), name='my-leagues'),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('public-leagues/', PublicLeaguesView.as_view(), name='public-leagues'),
    path('join-league/<int:league_id>/', join_league, name='join-league'),
    path('joined-leagues/', joined_leagues, name='joined-leagues'),
    path('/update-league/<int:league_id>/', update_league, name='update-league'),

    path('chat/<int:league_id>/', ChatView.as_view(), name='chat'), #added for chats

    path('delete-league/<int:league_id>/', delete_league, name='delete-league'),
    path('leave-league/<int:league_id>/', leave_league, name='leave-league'),

    path('/league-participants/<int:league_id>/', league_participants_view, name='league-participants'),
    
     # 🔍 Search endpoint
    path('search-leagues/', views.search_leagues, name='search-leagues'),

   
]

