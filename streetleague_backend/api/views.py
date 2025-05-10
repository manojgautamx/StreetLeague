from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LeagueSerializer, MessageSerializer, ChatSerializer
from .models import League, Chat, Message
from django.contrib.auth import get_user_model
from streetleague_backend.firebase_config import db



User = get_user_model()

# User Registration View
@api_view(['POST'])
@permission_classes([AllowAny])
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

    #return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

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
            # Create the league object
            league = serializer.save(created_by=request.user)
            
            # Create chat for the league in the Django backend
            chat = Chat.objects.create(league=league)
            
            # Firebase chat initialization
            chat_data = {
                'league_id': league.id,
                'league_name': league.name,  # Optional: Add more details if needed
                'admin_id': request.user.id,  # Set the creator as the admin
                'participants': [request.user.id]  # Initially only the creator
            }
            
            # Create a chat document in Firebase
            try:
                db.collection('league_chats').document(str(league.id)).set(chat_data)
            except Exception as e:
                return Response({'detail': f'Error creating chat in Firebase: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List My Leagues
class MyLeaguesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        leagues = League.objects.filter(created_by=request.user)
        serializer = LeagueSerializer(leagues, many=True)
        return Response(serializer.data)
    
class PublicLeaguesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        leagues = League.objects.exclude(created_by=request.user)
        serializer = LeagueSerializer(leagues, many=True)
        return Response(serializer.data)

# 🔥 NEW: Join League View
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)
        if request.user in league.participants.all():
            return Response({'detail': 'You already joined this league.'}, status=400)
        league.participants.add(request.user)

        return Response({'detail': 'Successfully joined the league.'}, status=200)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)


# 🔥 NEW: List Joined Leagues (user is a participant but not creator)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def joined_leagues(request):
    leagues = League.objects.filter(participants=request.user).exclude(created_by=request.user)
    serializer = LeagueSerializer(leagues, many=True)
    return Response(serializer.data)

# 🔥 NEW: Update League View
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
    
# Chat View (GET + POST)
class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, league_id):
        chat, _ = Chat.objects.get_or_create(league_id=league_id)
        messages = Message.objects.filter(chat=chat).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, league_id):
        chat, _ = Chat.objects.get_or_create(league_id=league_id)
        content = request.data.get('content')

        if not content:
            return Response({'error': 'Message content required'}, status=400)

        # Save to Django DB (using 'user' instead of 'sender')
        message = Message.objects.create(chat=chat, user=request.user, content=content)

        # 🔥 Save to Firestore
        firestore_data = {
            'sender': request.user.username,
            'user_id': str(request.user.id),  # Use Firebase UID if available
            'content': content,
            'timestamp': message.created_at.isoformat()
        }
        db.collection(f'league_{league_id}_chat').add(firestore_data)

        return Response(MessageSerializer(message).data, status=201)
    
#If user is Creator / host Can delete the League 
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)

        # Ensure the user is the creator (host) before allowing deletion
        if league.created_by != request.user:
            return Response({'detail': 'You do not have permission to delete this league.'}, status=403)

        # Delete the related chat and messages
        chat = Chat.objects.filter(league=league).first()  # Get the chat associated with the league
        if chat:
            # Deleting all the messages associated with the chat
            Message.objects.filter(chat=chat).delete()
            # Deleting the chat itself
            chat.delete()

        # Delete the league itself
        league.delete()

        return Response({'detail': 'League and associated chat deleted successfully.'}, status=204)
    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)
    
#If User is Participant Can Leave the League    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_league(request, league_id):
    try:
        league = League.objects.get(id=league_id)

        if request.user == league.created_by:
            return Response({'detail': 'Host cannot leave the league. You may delete it instead.'}, status=400)

        if request.user not in league.participants.all():
            return Response({'detail': 'You are not a participant of this league.'}, status=400)

        league.participants.remove(request.user)
        return Response({'detail': 'You have left the league.'}, status=200)

    except League.DoesNotExist:
        return Response({'detail': 'League not found.'}, status=404)    