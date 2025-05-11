from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import League, Chat, Message

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LeagueSerializer(serializers.ModelSerializer):
    # Serialize participants' usernames (can be customized if more details are needed)
    participants = UserSerializer(many=True, read_only=True)
    
    # Serialize the creator (host) of the league
    created_by = UserSerializer(read_only=True)

    # Check if the current user is joined in this league
    is_joined = serializers.SerializerMethodField()

    class Meta:
        model = League
        fields = '__all__'
        read_only_fields = ('created_by', 'is_joined')  # Ensure that created_by and is_joined are read-only

    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            # Check if the current user is part of the league
            return obj.participants.filter(id=request.user.id).exists()
        return False

class MessageSerializer(serializers.ModelSerializer):
    # Serialize message sender (user)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'content', 'user', 'created_at')

class ChatSerializer(serializers.ModelSerializer):
    # Include league data in the chat serializer
    league = LeagueSerializer(read_only=True)
    # Include messages related to the chat
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'league', 'messages', 'created_at')
