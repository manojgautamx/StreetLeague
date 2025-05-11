from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LeagueSerializer, MessageSerializer, ChatSerializer
from .models import League, Chat, Message
from django.contrib.auth import get_user_model
from django.utils import timezone
from streetleague_backend.firebase_config import db
from rest_framework.permissions import IsAuthenticated


User = get_user_model()

# Utility: Automatically update league status
def auto_update_league_status(league):
    if league.status == 'active' and league.date_time < timezone.now():
        league.status = 'completed'
        league.save()

# User Registration View
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'detail': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'detail': 'Email already in use.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=status.HTTP_201_CREATED)

# Create League View
class CreateLeagueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LeagueSerializer(data=request.data)
        if serializer.is_valid():
            league = serializer.save(created_by=request.user)
            
            # Create chat for the league
            chat = Chat.objects.create(league=league)

            # Add to Firestore
            chat_data = {
                'league_id': league.id,
                'league_name': league.name,
                'admin_id': request.user.id,
                'participants': [request.user.id]
            }

            try:
                db.collection('league_chats').document(str(league.id)).set(chat_data)
            except Exception as e:
                return Response({'detail': f'Error creating chat in Firebase: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🔥 NEW: List Joined Leagues (user is a participant but not creator)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def joined_leagues(request):
    leagues = League.objects.filter(participants=request.user).exclude(created_by=request.user)
    serializer = LeagueSerializer(leagues, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)

        # Ensure only the creator can update the league
        if league.created_by != request.user:
            return Response({'detail': 'You do not have permission to edit this league.'}, status=403)

        serializer = LeagueSerializer(league, data=request.data)
        if serializer.is_valid():
            serializer.save()  # created_by remains unchanged
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)

# Join League View (Updated without max participants restriction)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)
        auto_update_league_status(league)

        if league.status == 'completed':
            return Response({'detail': 'Cannot join. This league is already completed.'}, status=400)

        if request.user in league.participants.all():
            return Response({'detail': 'You already joined this league.'}, status=400)

        league.participants.add(request.user)
        return Response({'detail': 'Successfully joined the league.'}, status=200)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)

# Leave League View
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)
        auto_update_league_status(league)

        if request.user == league.created_by:
            return Response({'detail': 'Host cannot leave the league. You may delete it instead.'}, status=400)

        if request.user not in league.participants.all():
            return Response({'detail': 'You are not a participant of this league.'}, status=400)

        league.participants.remove(request.user)
        return Response({'detail': 'You have left the league.'}, status=200)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)

class MyLeaguesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get leagues the authenticated user is participating in
        leagues = League.objects.filter(participants=request.user)
        serializer = LeagueSerializer(leagues, many=True)
        return Response(serializer.data)

# Edit League View (Only host can edit)
class EditLeagueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, league_id):
        try:
            league = League.objects.get(id=league_id)

            if league.created_by != request.user:
                return Response({'detail': 'You do not have permission to edit this league.'}, status=403)

            serializer = LeagueSerializer(league, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except League.DoesNotExist:
            return Response({'detail': 'League not found.'}, status=404)

# Delete League View
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)

        if league.created_by != request.user:
            return Response({'detail': 'You do not have permission to delete this league.'}, status=403)

        # Delete related chat and messages
        chat = Chat.objects.filter(league=league).first()
        if chat:
            Message.objects.filter(chat=chat).delete()
            chat.delete()

        league.delete()
        return Response({'detail': 'League and associated chat deleted successfully.'}, status=204)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)

class PublicLeaguesView(APIView):
    permission_classes = [IsAuthenticated]  # Or AllowAny if you want non-authenticated users to access

    def get(self, request):
        # Fetch all public leagues (you can filter by conditions like 'active' status)
        leagues = League.objects.filter(status='active')  # Example condition for active leagues
        serializer = LeagueSerializer(leagues, many=True)
        return Response(serializer.data)

# Chat View
class ChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, league_id):
        try:
            league = League.objects.get(id=league_id)
            auto_update_league_status(league)

            chat, _ = Chat.objects.get_or_create(league=league)
            messages = Message.objects.filter(chat=chat).order_by('created_at')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except League.DoesNotExist:
            return Response({'detail': 'League not found.'}, status=404)

    def post(self, request, league_id):
        try:
            league = League.objects.get(id=league_id)
            auto_update_league_status(league)

            if league.status == 'completed':
                return Response({'error': 'This league has been completed. You cannot send messages.'}, status=400)

            chat, _ = Chat.objects.get_or_create(league=league)
            content = request.data.get('content')

            if not content:
                return Response({'error': 'Message content required'}, status=400)

            message = Message.objects.create(chat=chat, user=request.user, content=content)

            firestore_data = {
                'sender': request.user.username,
                'user_id': str(request.user.id),
                'content': content,
                'timestamp': message.created_at.isoformat()
            }

            db.collection(f'league_{league_id}_chat').add(firestore_data)
            return Response(MessageSerializer(message).data, status=201)
        except League.DoesNotExist:
            return Response({'detail': 'League not found.'}, status=404)

class KickPlayerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, league_id, player_id):
        # Check if the user is the host
        try:
            league = League.objects.get(id=league_id)
        except League.DoesNotExist:
            return Response({"error": "League not found."}, status=status.HTTP_404_NOT_FOUND)

        if league.created_by != request.user:
            return Response({"error": "You are not the host of this league."}, status=status.HTTP_403_FORBIDDEN)

        # Check if the player is in the league
        try:
            player = User.objects.get(id=player_id)
        except User.DoesNotExist:
            return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)

        if player not in league.participants.all():
            return Response({"error": "Player is not a participant in this league."}, status=status.HTTP_400_BAD_REQUEST)

        # Remove the player from the league
        league.participants.remove(player)
        return Response({"message": "Player has been kicked from the league."}, status=status.HTTP_200_OK)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def league_participants_view(request, league_id):
    try:
        league = League.objects.get(id=league_id)
        participants = league.participants.all()
        host = league.created_by

        data = {
            "host": {
                "id": host.id,
                "username": host.username,
            },
            "participants": [
                {
                    "id": p.id,
                    "username": p.username
                } for p in participants
            ],
            "current_user": request.user.id
        }

        return Response(data, status=200)
    except League.DoesNotExist:
        return Response({"detail": "League not found."}, status=404)
