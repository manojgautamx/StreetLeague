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
    class Meta:
        model = League
        fields = '__all__'
        read_only_fields = ('created_by','is_joined') #added Is_joined 

#Added this function to check for Join Button Issue
    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.participants.filter(id=request.user.id).exists()
        return False    

class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ('id', 'content', 'user', 'created_at')

class ChatSerializer(serializers.ModelSerializer):
    league = LeagueSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'league', 'messages', 'created_at')
